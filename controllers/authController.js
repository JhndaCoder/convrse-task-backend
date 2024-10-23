const User = require ('../models/User');
const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcryptjs');

const register = async (req, res) => {
  const {name, email, password, role} = req.body;
  const hashedPassword = await bcrypt.hash (password, 10);

  try {
    const user = await User.create ({
      name,
      email,
      password: hashedPassword,
      role,
    });
    const token = jwt.sign (
      {userId: user._id, role: user.role},
      process.env.JWT_SECRET
    );
    res.status (201).json ({token});
  } catch (error) {
    res.status (400).json ({error: 'User registration failed'});
  }
};

const login = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne ({email});
    if (!user || !await bcrypt.compare (password, user.password)) {
      return res.status (401).json ({error: 'Invalid credentials'});
    }
    const token = jwt.sign (
      {userId: user._id, role: user.role},
      process.env.JWT_SECRET
    );
    res.json ({token});
  } catch (error) {
    res.status (500).json ({error: 'Login failed'});
  }
};

module.exports = {register, login};
