const express = require ('express');
const {register, login} = require ('../controllers/authController');
const {check, validationResult} = require ('express-validator');
const router = express.Router ();
const User = require ('../models/User');

router.post (
  '/register',
  [
    check ('email', 'Please provide a valid email').isEmail (),
    check ('password', 'Password must be at least 6 characters').isLength ({
      min: 6,
    }),
  ],
  (req, res, next) => {
    const errors = validationResult (req);
    if (!errors.isEmpty ()) {
      return res.status (400).json ({errors: errors.array ()});
    }
    next ();
  },
  register
);

router.post (
  '/login',
  [
    check ('email', 'Please provide a valid email').isEmail (),
    check ('password', 'Password is required').exists (),
  ],
  (req, res, next) => {
    const errors = validationResult (req);
    if (!errors.isEmpty ()) {
      return res.status (400).json ({errors: errors.array ()});
    }
    next ();
  },
  login
);

router.get ('/email/:email', async (req, res) => {
  try {
    const user = await User.findOne ({email: req.params.email});
    if (!user) {
      return res.status (404).json ({error: 'User not found'});
    }
    res.status (200).json ({message: 'User exists', user});
  } catch (error) {
    console.error ('Error checking email:', error);
    res.status (500).json ({error: 'Failed to check email'});
  }
});

module.exports = router;
