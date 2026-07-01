const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const enrollmentService = require('./enrollmentService');
const { determineTier, DEFAULT_LOYALTY_CONFIG } = require('./loyaltyService');
const { sendEmail } = require('./emailService');

/**
 * Order Service
 *
 * Centralized business logic for processing and completing orders.
 * Ensures consistency across different payment methods (Manual, PayOS, Webhook).
 */

/**
 * Completes an order by:
 * 1. Updating order status to CONFIRMED
 * 2. Creating an enrollment for the user
 * 3. Updating user's loyalty status (totalSpent, points, memberTier)
 * 4. Sending a confirmation email (non-blocking)
 *
 * @param {string} orderId - The ID of the order to complete
 * @param {object} [completionData] - Optional additional data for the order update (e.g. gateway info)
 * @param {object} [tx] - Optional Prisma transaction client
 */
async function completeOrder(orderId, completionData = {}, tx = null) {
  const performCompletion = async (innerTx) => {
    // 1. Fetch order and user INSIDE the transaction to ensure consistency
    const order = await innerTx.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, totalSpent: true, points: true, email: true, fullName: true } },
        program: { select: { title: true } }
      }
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found.`);
    }

    // 2. Atomic status check
    if (order.status === 'CONFIRMED') {
      console.warn(`Order ${orderId} is already confirmed. Skipping duplicate completion logic.`);
      return order;
    }

    // A. Update Order Status
    const updatedOrder = await innerTx.order.update({
      where: { id: orderId },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date(),
        ...completionData
      }
    });

    // B. Create Enrollment
    await enrollmentService.createEnrollmentForOrder(orderId, innerTx);

    // C. Update User Loyalty
    let loyaltyConfig = DEFAULT_LOYALTY_CONFIG;
    try {
      const loyaltySetting = await innerTx.setting.findUnique({ where: { key: 'loyaltyConfig' } });
      if (loyaltySetting) loyaltyConfig = loyaltySetting.value;
    } catch (e) {
      console.warn('Failed to fetch loyalty config, using defaults.');
    }

    const user = order.user;
    const newTotalSpent = (user.totalSpent || 0) + (order.finalPrice || order.amount - (order.vatAmount || 0));
    const newPoints = (user.points || 0) + (order.pointsEarned || 0);
    const newTier = determineTier(newTotalSpent, loyaltyConfig.tiers);

    await innerTx.user.update({
      where: { id: user.id },
      data: {
        totalSpent: newTotalSpent,
        points: newPoints,
        memberTier: newTier,
      }
    });

    console.log(`Order ${order.orderCode} completed: Enrollment created & Loyalty updated (Tier: ${newTier}, Points: +${order.pointsEarned}).`);
    return { updatedOrder, order };
  };

  let result;
  if (tx) {
    result = await performCompletion(tx);
  } else {
    result = await prisma.$transaction(performCompletion);
  }

  // D. Send confirmation email — non-blocking, never fails the transaction
  const { order } = result || {};
  if (order?.user?.email) {
    sendConfirmationEmail(order).catch((err) =>
      console.error(`Email confirmation failed for order ${order.orderCode}:`, err.message)
    );
  }

  return result?.updatedOrder || result;
}

/**
 * Sends a payment confirmation email to the customer.
 * Called after the DB transaction commits — failure is logged, not thrown.
 */
async function sendConfirmationEmail(order) {
  const amountFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.amount);
  const courseTitle = order.program?.title || 'khóa học';
  const userName = order.user?.fullName || 'bạn';
  const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0].trim();

  await sendEmail({
    to: order.user.email,
    subject: `✅ Xác nhận thanh toán thành công — ${courseTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #f97316; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">🎉 Thanh toán thành công!</h1>
        </div>
        <div style="padding: 32px; background: #fff; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px;">Xin chào <strong>${userName}</strong>,</p>
          <p>Chúng tôi xác nhận bạn đã thanh toán thành công và có thể bắt đầu học ngay.</p>

          <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #666; width: 40%;">Mã đơn hàng</td>
                <td style="padding: 6px 0; font-weight: bold;">${order.orderCode}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">Khóa học</td>
                <td style="padding: 6px 0; font-weight: bold;">${courseTitle}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">Số tiền</td>
                <td style="padding: 6px 0; font-weight: bold; color: #f97316;">${amountFormatted}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin-top: 28px;">
            <a href="${frontendUrl}/courses"
               style="background: #f97316; color: #fff; padding: 14px 32px; border-radius: 8px;
                      text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
              Bắt đầu học ngay →
            </a>
          </div>

          <p style="margin-top: 32px; font-size: 13px; color: #999; border-top: 1px solid #eee; padding-top: 16px;">
            Nếu bạn có thắc mắc, vui lòng liên hệ qua email hoặc fanpage của chúng tôi.<br>
            Cảm ơn bạn đã tin tưởng đăng ký khóa học! 🧁
          </p>
        </div>
      </div>
    `,
  });
}

module.exports = {
  completeOrder
};
