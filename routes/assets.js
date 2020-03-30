const express = require('express');

const router = express.Router();
const Asset = require('../models/Asset');
const {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
  getAssetStats
} = require('../controllers/assets');
const propertyRouter = require('../routes/properties');
const feesRouter = require('../routes/fees');

//const { createProperty,getAllProperties } = require('../controllers/properties');
// router.post('/:assetId/properties', protect, authorize('admin'), createProperty);
// router.get('/:assetId/properties', protect, authorize('admin'), getAllProperties);
router.use('/:assetId/properties', propertyRouter);

// const { getAllFees } = require('../controllers/fees');
// router.get('/:assetId/fees', protect, authorize('admin'), getAllFees);
router.use('/:assetId/fees', feesRouter);

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

router.use(protect, authorize('admin'));

router.route('/asset-stats').get(getAssetStats);

router
  .route('/')
  .get(advancedResults(Asset), getAllAssets)
  .post(createAsset);

router
  .route('/:id')
  .get(getAssetById)
  .patch(updateAsset)
  .delete(deleteAsset);

module.exports = router;
