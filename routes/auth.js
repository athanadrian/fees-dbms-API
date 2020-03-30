const express = require('express');

const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  singup,
  signin,
  forgotPassword,
  resetPassword,
  updateUserPassword
} = require('../controllers/auth');

router.post('/signup', singup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:resetToken', resetPassword);
router.patch('/update-user-password', protect, updateUserPassword);

module.exports = router;
