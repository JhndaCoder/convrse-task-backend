const jwt = require ('jsonwebtoken');
const User = require ('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.header ('Authorization').replace ('Bearer ', '');
  if (!token) {
    return res.status (401).json ({error: 'No token, authorization denied'});
  }
  try {
    const decoded = jwt.verify (token, process.env.JWT_SECRET);
    req.user = await User.findById (decoded.id);

    if (!req.user) {
      return res.status (401).json ({error: 'User not found'});
    }

    next ();
  } catch (error) {
    res.status (401).json ({error: 'Invalid token'});
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status (403).json ({error: 'Access denied'});
  }
  next ();
};

module.exports = {authMiddleware, adminMiddleware};
