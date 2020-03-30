const express = require('express');

const router = express.Router();

const {
  createPercentage,
  getAllPercentages,
  getPercentageById,
  updatePercentage,
  deletePercentage
} = require('../controllers/percentages');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin', 'manager'));

router
  .route('/')
  .get(getAllPercentages)
  .post(createPercentage);

router
  .route('/:id')
  .get(getPercentageById)
  .patch(updatePercentage)
  .delete(deletePercentage);

module.exports = router;
