const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET active payment config (Public)
exports.getPaymentConfig = async (req, res) => {
  try {
    const config = await prisma.paymentConfig.findFirst({
      where: { isActive: true },
      select: {
        id: true,
        bankName: true,
        accountNumber: true,
        accountHolder: true,
        qrImage: true,
        transferNote: true,
        isActive: true,
        // webhookSecret is NOT exposed publicly
      }
    });

    if (!config) {
      return res.status(404).json({ error: 'Payment configuration not found. Please contact admin.' });
    }

    res.json(config);
  } catch (error) {
    console.error('getPaymentConfig error:', error);
    res.status(500).json({ error: 'Failed to fetch payment configuration' });
  }
};

// PUT update/create payment config (Admin only)
exports.updatePaymentConfig = async (req, res) => {
  try {
    const { bankName, accountNumber, accountHolder, qrImage, transferNote, webhookSecret } = req.body;

    if (!bankName || !accountNumber || !accountHolder) {
      return res.status(400).json({ error: 'Bank name, account number, and account holder are required.' });
    }

    // Deactivate all existing configs first
    await prisma.paymentConfig.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });

    // Check if we have an existing config to update or need to create
    const existing = await prisma.paymentConfig.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    let config;
    if (existing) {
      config = await prisma.paymentConfig.update({
        where: { id: existing.id },
        data: {
          bankName,
          accountNumber,
          accountHolder,
          qrImage: qrImage || null,
          transferNote: transferNote || null,
          webhookSecret: webhookSecret || existing.webhookSecret,
          isActive: true
        }
      });
    } else {
      config = await prisma.paymentConfig.create({
        data: {
          bankName,
          accountNumber,
          accountHolder,
          qrImage: qrImage || null,
          transferNote: transferNote || null,
          webhookSecret: webhookSecret || null,
          isActive: true
        }
      });
    }

    res.json({ message: 'Payment configuration updated successfully', config });
  } catch (error) {
    console.error('updatePaymentConfig error:', error);
    res.status(500).json({ error: 'Failed to update payment configuration' });
  }
};

// GET full payment config including webhook secret (Admin only)
exports.getPaymentConfigAdmin = async (req, res) => {
  try {
    const config = await prisma.paymentConfig.findFirst({
      where: { isActive: true }
    });

    if (!config) {
      return res.json(null);
    }

    res.json(config);
  } catch (error) {
    console.error('getPaymentConfigAdmin error:', error);
    res.status(500).json({ error: 'Failed to fetch payment configuration' });
  }
};
