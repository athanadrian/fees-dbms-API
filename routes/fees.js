const express = require('express');

const router = express.Router({ mergeParams: true });

const {
  createFee,
  getAllFees,
  getFeeById,
  updateFee,
  deleteFee,
  aliasGetRecentFees,
  getFeeStats,
  publishFee
  //updateFees
} = require('../controllers/fees');
const Fee = require('../models/Fee');
const { protect, authorize, setAssetId } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

router.get('/recent-3-fees', aliasGetRecentFees, advancedResults(Fee), getAllFees);
router.get('/fee-stats', getFeeStats);
router.post('/publish/:id', protect, authorize('admin', 'manager'), publishFee);

// TOdo IMPLEMENTED
//router.patch('/:title/update-fees', protect, authorize('admin', 'manager'), updateFees);

router
  .route('/')
  .get(advancedResults(Fee), getAllFees)
  //.get(getAllFees) // use advancedClassResults
  .post(protect, authorize('admin', 'manager'), setAssetId, createFee);

router
  .route('/:id')
  .get(protect, getFeeById)
  .patch(protect, authorize('admin', 'manager'), updateFee)
  .delete(protect, authorize('admin', 'manager'), deleteFee);

module.exports = router;
