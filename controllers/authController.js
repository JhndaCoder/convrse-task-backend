const User = require ('../models/User');
const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcryptjs');

const register = async (req, res) => {
  try {
    const {name, email, password, role} = req.body;

    const existingUser = await User.findOne ({email});
    if (existingUser) {
      return res.status (400).json ({error: 'Email already registered'});
    }

    const hashedPassword = await bcrypt.hash (password, 10);
    const user = new User ({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer',
    });

    await user.save ();
    res.status (201).json ({message: 'User registered successfully'});
  } catch (error) {
    console.error ('Registration error:', error);
    res.status (500).json ({error: 'Failed to register user'});
  }
};

const login = async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne ({email});
    if (!user) {
      return res.status (400).json ({error: 'Invalid email or password'});
    }

    const isMatch = await bcrypt.compare (password, user.password);
    if (!isMatch) {
      return res.status (400).json ({error: 'Invalid email or password'});
    }

    const token = jwt.sign ({id: user._id}, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json ({token, role: user.role});
  } catch (error) {
    console.error ('Login error:', error);
    res.status (500).json ({error: 'Failed to login'});
  }
};

module.exports = {register, login};
