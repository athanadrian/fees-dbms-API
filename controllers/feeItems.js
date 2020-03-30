const FeeItem = require('../models/FeeItem');
const {
  createDoc,
  getAllDocs,
  getSingleDoc,
  updateDoc,
  deleteDoc
} = require('./factory');

//@desc         Get all FeeItems
//@route        GET /api/v1/fee-items
//@access       Private - (Admin - Manager)
exports.getAllFeeItems = getAllDocs(FeeItem);

//@desc         Get Single FeeItem
//@route        GET /api/v1/feeItems/:id
//@access       Private Admin
exports.getFeeItemById = getSingleDoc(FeeItem);

//@desc         Create FeeItem
//@route        POST /api/v1/feeItems
//@access       Private
exports.createFeeItem = createDoc(FeeItem);

//@desc         Update FeeItem
//@route        PATCHE /api/v1/feeItems/:id
//@access       Private
exports.updateFeeItem = updateDoc(FeeItem);

//@desc         Delete FeeItem
//@route        DELETE /api/v1/feeItems/:id
//@access       Private
exports.deleteFeeItem = deleteDoc(FeeItem);
