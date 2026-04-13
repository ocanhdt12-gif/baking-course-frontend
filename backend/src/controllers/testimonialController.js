const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while fetching testimonials' });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const { name, role, text, excerpt, signature } = req.body;
    const testimonial = await prisma.testimonial.create({
      data: { name, role, text, excerpt, signature }
    });
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, text, excerpt, signature } = req.body;
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { name, role, text, excerpt, signature }
    });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.testimonial.delete({ where: { id } });
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};
