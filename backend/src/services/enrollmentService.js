const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Creates an Enrollment record for a confirmed Order
 * Automatically handles VIDEO_COURSE vs LIVE_CLASS
 */
exports.createEnrollmentForOrder = async (orderId, tx = null) => {
  const client = tx || prisma;
  try {
    const order = await client.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        program: true
      }
    });

    if (!order) {
      console.error(`createEnrollmentForOrder: Order ${orderId} not found`);
      return null;
    }

    if (order.status !== 'CONFIRMED') {
      console.error(`createEnrollmentForOrder: Cannot enroll for non-confirmed order ${orderId} (Status: ${order.status})`);
      return null;
    }

    // Atomic upsert: avoids TOCTOU race condition between findFirst + create
    const enrollment = await client.enrollment.upsert({
      where: {
        userId_programId: {
          userId: order.userId,
          programId: order.programId,
        }
      },
      update: {}, // already enrolled — no-op
      create: {
        classSessionId: order.classSessionId, // null for VIDEO_COURSE
        userId: order.userId,
        programId: order.programId,
        fullName: order.user ? order.user.fullName : 'Học viên ẩn danh',
        email: order.user ? order.user.email : 'No email',
        phone: order.user?.phoneNumber || null,
        status: 'CONFIRMED'
      }
    });

    console.log(`Upserted Enrollment ${enrollment.id} for Order ${order.id}`);
    return enrollment;
  } catch (err) {
    console.error('createEnrollmentForOrder error:', err);
    throw err;
  }
};
