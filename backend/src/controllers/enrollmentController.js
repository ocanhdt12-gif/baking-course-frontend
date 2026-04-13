const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all enrollments (Admin only)
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        classSession: {
          include: { program: true }
        }
      }
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
};

// POST a new enrollment (Public)
exports.submitEnrollment = async (req, res) => {
  try {
    const { fullName, email, phone, classSessionId, userId } = req.body;
    
    // Basic validation
    if (!fullName || !email || !classSessionId) {
      return res.status(400).json({ error: 'Full name, email, and class session selection are required.' });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        fullName,
        email,
        phone,
        classSessionId,
        userId: userId || null
      }
    });

    res.status(201).json({ message: 'Enrollment successful! We will contact you shortly to confirm your booking.', enrollment });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing your enrollment.' });
  }
};

// PATCH to update enrollment status (Admin)
exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { status } = req.body; // e.g. "CONFIRMED", "CANCELLED"
    const enrollment = await prisma.enrollment.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json({ message: 'Enrollment status updated', enrollment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update enrollment status' });
  }
};

// DELETE enrollment (Admin)
exports.deleteEnrollment = async (req, res) => {
  try {
    await prisma.enrollment.delete({ where: { id: req.params.id } });
    res.json({ message: 'Enrollment record deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete enrollment' });
  }
};
