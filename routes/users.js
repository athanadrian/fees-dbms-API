const express = require('express');

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  getMe,
  updateUserDetails,
  deleteUser,
  restoreUser,
  deActivateUser
} = require('../controllers/users.js');
const feesRouter = require('../routes/fees');

// const { getAllFees } = require('../controllers/fees');
// router.get('/:userId/fees', protect, authorize('admin'), getAllFees);
router.use('/:userId/fees', protect, feesRouter);

router.use(protect);

router.get('/', authorize('admin', 'manager'), getAllUsers);
router.get('/me', getMe, getUserById);
router
  .route('/:id')
  .get(authorize('admin', 'manager'), getUserById)
  .delete(authorize('admin'), deleteUser);

router.patch('/updateMe', updateUserDetails);
router.patch('/deactivate-user/:id', authorize('admin'), deActivateUser);
router.patch('/restore-user/:id', authorize('admin'), restoreUser);

module.exports = router;
