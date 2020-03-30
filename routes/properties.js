const express = require('express');

const router = express.Router({ mergeParams: true });
const Property = require('../models/Property');
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getPropertyStats,
  getPropertyFees
} = require('../controllers/properties');
const feesRouter = require('../routes/fees');
const { protect, authorize, setAssetId } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

//router.use(protect);

//const { getAllFees } = require('../controllers/fees');
// router.get('/:propertyId/fees', protect, authorize('admin'), getAllFees);
router.use('/:propertyId/fees', feesRouter);

router.get('/property-stats', authorize('admin'), getPropertyStats);
router.get('/:id/fees', authorize('admin', 'manager'), getPropertyFees);

router
  .route('/')
  // *** FOR TESTING
  .get(advancedResults(Property), getAllProperties)
  // .get(authorize('admin', 'manager'), advancedResults(Property), getAllProperties)
  // .get(getAllProperties) // use advancedClassResults
  .post(authorize('admin'), setAssetId, createProperty);

router
  .route('/:id')
  .get(authorize('admin', 'manager'), getPropertyById)
  .patch(authorize('admin'), updateProperty)
  .delete(authorize('admin'), deleteProperty);

module.exports = router;
