const jwt = require ('jsonwebtoken');
const User = require ('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header ('Authorization');
    if (!authHeader || !authHeader.startsWith ('Bearer ')) {
      return res.status (401).json ({error: 'No token, authorization denied'});
    }

    const token = authHeader.replace ('Bearer ', '');
    const decoded = jwt.verify (token, process.env.JWT_SECRET);

    const user = await User.findById (decoded.id);
    if (!user) {
      return res.status (401).json ({error: 'User not found'});
    }

    req.user = user;
    next ();
  } catch (error) {
    console.error ('Authentication error:', error.message);
    res.status (401).json ({error: 'Invalid token'});
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status (403).json ({error: 'Access denied'});
  }
  next ();
};

module.exports = {authMiddleware, adminMiddleware};
