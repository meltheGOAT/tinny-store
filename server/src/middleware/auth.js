const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tinny_luxury_atelier_jwt_secret_2026_abuja';

module.exports = function verifyAdminToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No authorization token provided.' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired session token. Please re-authenticate.' });
  }
};
