const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

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
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const contactRoutes = require('./routes/contactRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentConfigRoutes = require('./routes/paymentConfigRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const vnpayRoutes = require('./routes/vnpayRoutes');

app.use('/api/programs', programRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chiefs', chiefRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment-config', paymentConfigRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/vnpay', vnpayRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
