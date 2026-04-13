const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all contacts (Admin only)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

// POST a new contact message (Public)
exports.submitContact = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;
    
    // Basic validation
    if (!fullName || !email || !message) {
      return res.status(400).json({ error: 'Full name, email, and message are required fields.' });
    }

    const contact = await prisma.contact.create({
      data: {
        fullName,
        email,
        subject,
        message
      }
    });

    res.status(201).json({ message: 'Your message has been sent successfully. We will get back to you soon!', contact });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while submitting your message.' });
  }
};

// DELETE contact message (Admin)
exports.deleteContact = async (req, res) => {
  try {
    await prisma.contact.delete({ where: { id: req.params.id } });
    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact message' });
  }
};
