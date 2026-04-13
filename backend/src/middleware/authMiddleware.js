const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');
  let token;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = req.header('x-auth-token');
  }

  // Check if no token
  if (!token) {
    return res.status(401).json({ error: 'Truy cập bị từ chối, không tìm thấy Token.' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_123');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token không hợp lệ.' });
  }
};
