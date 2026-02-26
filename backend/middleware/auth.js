const jwt  = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    const h = req.headers.authorization;
    if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Not authenticated' });
    const decoded = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch { return res.status(401).json({ error: 'Invalid token' }); }
};

exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
};

exports.scraperAuth = (req, res, next) => {
  if (req.headers['x-scraper-secret'] !== process.env.SCRAPER_SECRET)
    return res.status(403).json({ error: 'Invalid scraper secret' });
  next();
};

exports.optionalAuth = async (req, res, next) => {
  try {
    const h = req.headers.authorization;
    if (h?.startsWith('Bearer ')) {
      const decoded = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
      req.user      = await User.findById(decoded.id);
    }
  } catch {}
  next();
};