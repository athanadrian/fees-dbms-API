const express = require('express');

const router = express.Router();

const {
  createFeeItem,
  getAllFeeItems,
  getFeeItemById,
  updateFeeItem,
  deleteFeeItem
} = require('../controllers/feeItems');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin', 'manager'));

router
  .route('/')
  .get(getAllFeeItems)
  .post(createFeeItem);

router
  .route('/:id')
  .get(getFeeItemById)
  .patch(updateFeeItem)
  .delete(deleteFeeItem);

module.exports = router;
