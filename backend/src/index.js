const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Fail fast if critical secrets are missing
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set. Server will not start.');
  process.exit(1);
}
if (!process.env.JWT_REFRESH_SECRET) {
  console.error('FATAL: JWT_REFRESH_SECRET environment variable is not set. Server will not start.');
  process.exit(1);
}

const app = express();

// --- Security Middleware ---
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(s => s.trim());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Rate limiting: strict for payment endpoints
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window
  message: { error: 'Quá nhiều yêu cầu thanh toán. Vui lòng thử lại sau.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 15 requests per window (login, register, forgot-password)
  message: { error: 'Quá nhiều yêu cầu xác thực. Vui lòng thử lại sau.' },
});

app.use(express.json({ limit: '1mb' }));

// Serve uploads only to authenticated users (prevents PII file enumeration)
const auth = require('./middleware/authMiddleware');
app.use('/uploads', auth, express.static('uploads'));

// Basic route to test the server
app.get('/api', (req, res) => {
  res.json({ message: 'Baking Course API is running' });
});

// Routes will be imported here
const programRoutes = require('./routes/programRoutes');
const postRoutes = require('./routes/postRoutes');
const chiefRoutes = require('./routes/chiefRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const contactRoutes = require('./routes/contactRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentConfigRoutes = require('./routes/paymentConfigRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
// VNPay removed — no longer used
const payosRoutes = require('./routes/payosRoutes'); // rate-limit handled inside route file
const statsRoutes = require('./routes/statsRoutes');
const settingRoutes = require('./routes/settingRoutes');
const studentWorkRoutes = require('./routes/studentWorkRoutes');
const promoCodeRoutes = require('./routes/promoCodeRoutes');
const qnaRoutes = require('./routes/qnaRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/programs', programRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chiefs', chiefRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/orders', paymentLimiter, orderRoutes);
app.use('/api/payment-config', paymentConfigRoutes);
app.use('/api/webhook', paymentLimiter, webhookRoutes);
// PayOS: rate-limit chỉ cho create-payment-url, KHÔNG cho webhook (PayOS retry)
app.use('/api/payos', payosRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/student-work', studentWorkRoutes);
app.use('/api/promo-codes', promoCodeRoutes);
app.use('/api/qna', qnaRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/users', userRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Start PENDING order expiry cleanup job (runs every hour)
  const { startCleanupJob } = require('./jobs/cleanupPendingOrders');
  startCleanupJob();

  // Schedule daily cleanup of orphan uploaded files at 3:00 AM
  const cron = require('node-cron');
  const { PrismaClient } = require('@prisma/client');
  const fs = require('fs');
  const path = require('path');

  cron.schedule('0 3 * * *', async () => {
    console.log('[CRON] Starting daily orphan file cleanup...');
    try {
      const prisma = new PrismaClient();
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) return;

      const filesOnDisk = fs.readdirSync(uploadsDir)
        .filter(f => !f.startsWith('.'))
        .map(f => `/uploads/${f}`);

      const [programs, posts, chiefs, orders, paymentConfigs] = await Promise.all([
        prisma.program.findMany({ select: { thumbnail: true, authorImage: true } }),
        prisma.post.findMany({ select: { thumbnail: true } }),
        prisma.chief.findMany({ select: { image: true } }),
        prisma.order.findMany({ select: { proofImage: true } }),
        prisma.paymentConfig.findMany({ select: { qrImage: true } }),
      ]);

      const referencedUrls = new Set();
      programs.forEach(p => { if (p.thumbnail) referencedUrls.add(p.thumbnail); if (p.authorImage) referencedUrls.add(p.authorImage); });
      posts.forEach(p => { if (p.thumbnail) referencedUrls.add(p.thumbnail); });
      chiefs.forEach(c => { if (c.image) referencedUrls.add(c.image); });
      orders.forEach(o => { if (o.proofImage) referencedUrls.add(o.proofImage); });
      paymentConfigs.forEach(pc => { if (pc.qrImage) referencedUrls.add(pc.qrImage); });

      const orphans = filesOnDisk.filter(f => !referencedUrls.has(f));
      let deleted = 0, freedBytes = 0;

      orphans.forEach(fileUrl => {
        try {
          const filePath = path.join(process.cwd(), fileUrl);
          freedBytes += fs.statSync(filePath).size;
          fs.unlinkSync(filePath);
          deleted++;
        } catch (e) { /* skip */ }
      });

      await prisma.$disconnect();
      const freedMB = (freedBytes / 1024 / 1024).toFixed(2);
      console.log(`[CRON] Cleanup done: ${deleted} orphan files deleted, ${freedMB} MB freed.`);
    } catch (err) {
      console.error('[CRON] Cleanup failed:', err.message);
    }
  });
});
