const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Vui lòng cung cấp email và password.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Tài khoản hoặc mật khẩu không chính xác.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Tài khoản hoặc mật khẩu không chính xác.' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
        fullName: user.fullName
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret_123', {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: payload.user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi Server.');
  }
};

exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Cần cung cấp đủ tên, email và mật khẩu.' });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.status(400).json({ error: 'Email này đã được sử dụng.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: 'USER' // Mặc định tất cả user mới là Khách hàng
      }
    });

    const payload = {
      user: {
        id: user.id,
        role: user.role,
        fullName: user.fullName
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret_123', {
      expiresIn: '7d',
    });

    res.status(201).json({ token, user: payload.user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi Server.');
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        enrollments: {
          include: { 
            classSession: {
              include: { program: true }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin người dùng.' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi Server.');
  }
};
