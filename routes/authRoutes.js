const express = require ('express');
const {register, login} = require ('../controllers/authController');
const {check, validationResult} = require ('express-validator');
const router = express.Router ();

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

router.post ('/login', login);

module.exports = router;
