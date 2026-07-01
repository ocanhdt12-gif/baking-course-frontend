/**
 * Cleanup Pending Orders Job
 *
 * Runs every hour. Cancels PENDING orders older than 24 hours
 * that have not been paid or progressed. Refunds points and promo codes.
 *
 * This prevents:
 * - Users being blocked from re-purchasing ("Bạn đã có đơn đang chờ")
 * - Stale PENDING orders accumulating in the DB
 */

const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PENDING_EXPIRY_HOURS = 24;

async function cleanupExpiredPendingOrders() {
  const cutoff = new Date(Date.now() - PENDING_EXPIRY_HOURS * 60 * 60 * 1000);

  // Find all PENDING orders older than cutoff
  const expired = await prisma.order.findMany({
    where: {
      status: 'PENDING',
      createdAt: { lt: cutoff },
    },
    select: {
      id: true,
      orderCode: true,
      userId: true,
      pointsUsed: true,
      promoCodeId: true,
    },
  });

  if (expired.length === 0) return;

  console.log(`[Cleanup] Found ${expired.length} expired PENDING orders. Cancelling...`);

  for (const order of expired) {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: 'CANCELLED',
            adminNote: `Auto-cancelled: PENDING > ${PENDING_EXPIRY_HOURS}h without payment.`,
          },
        });

        if (order.pointsUsed > 0) {
          await tx.user.update({
            where: { id: order.userId },
            data: { points: { increment: order.pointsUsed } },
          });
        }

        if (order.promoCodeId) {
          await tx.promoCode.update({
            where: { id: order.promoCodeId },
            data: { usedCount: { decrement: 1 } },
          });
        }
      });

      console.log(`[Cleanup] Cancelled expired order ${order.orderCode}`);
    } catch (err) {
      // Log and continue — don't let one failure stop the rest
      console.error(`[Cleanup] Failed to cancel order ${order.orderCode}:`, err.message);
    }
  }
}

/**
 * Starts the cleanup cron job.
 * Runs every hour at minute 0.
 */
function startCleanupJob() {
  cron.schedule('0 * * * *', async () => {
    console.log('[Cleanup] Running expired PENDING orders cleanup...');
    try {
      await cleanupExpiredPendingOrders();
    } catch (err) {
      console.error('[Cleanup] Unexpected error during cleanup:', err.message);
    }
  });

  console.log('[Cleanup] Pending order cleanup job scheduled (every hour).');
}

module.exports = { startCleanupJob };
