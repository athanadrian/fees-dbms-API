/* eslint-disable node/no-unsupported-features/es-syntax */
//const fs = require('fs');

const Fee = require('../models/Fee');
const Property = require('../models/Property');
const Percentage = require('../models/Percentage');
const { createDoc, getAllDocs, getSingleDoc, deleteDoc } = require('./factory');
const asyncHandler = require('../utils/asyncHandler');
const calculateFee = require('../utils/calculateFee');
const ErrorResponse = require('../utils/errorResponse');

//@desc         Get Rec ent 3 Fees
//@route        GET /api/v1/recent-3-fees
//@access       Public
exports.aliasGetRecentFees = (req, res, next) => {
  req.query.limit = '3';
  req.query.sort = '-createdAt';
  req.query.fields = 'total,year,month';
  next();
};

//@desc         Publish Fee
//@route        PUT /api/v1/fees/publish/:id
//@access       Private
exports.publishFee = asyncHandler(async (req, res, next) => {
  const properties = await Property.find();

  properties.forEach(async property => {
    const fee = await Fee.findById(req.params.id);
    const { id, year, month, remarks, feeItems } = fee;
    const fees = [...feeItems];
    const { percentageItems } = await Percentage.findById(property.percentage);
    const calculatedFeeItems = calculateFee(percentageItems, fees);
    const nfee = {
      year,
      month,
      feeItems: calculatedFeeItems,
      remarks,
      percentage: property.percentage,
      property: property._id,
      user: property.user
    };
    await Fee.create(nfee).then(async () => {
      await Fee.updateOne({ _id: id }, { isPublished: true }, { new: true });
    });
  });
  res.status(200).json({
    status: 'success',
    message: 'Fee published!',
    data: properties.length
  });
});

exports.updateFee = asyncHandler(async (req, res, next) => {
  req.body.isPublished = false;
  const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!fee) {
    return next(new ErrorResponse('Document does not exist!', 404));
  }
  const { title } = fee;
  await Fee.deleteMany({ title, asset: null }).then(async () => {
    fee.isPublished = false;
    await fee.save();
  });

  // console.log('modified', fee.isModified('feeItems'));
  // if (fee.isModified('feeItems')) {
  //   fee.isPublished = true;
  //   await fee.save();
  // }
  res.status(200).json({
    //200 status OK with Data
    status: 'success',
    message: 'Document updated',
    data: fee
  });
});

//@desc         Get fee dbms statistics
//@route        GET /api/v1/fee-stats
//@access       Private
exports.getFeeStats = asyncHandler(async (req, res, next) => {
  const { year } = req.query;
  let matchYearObj;
  if (!year) {
    matchYearObj = { $gte: '2017' };
  } else {
    matchYearObj = { $eq: year };
  }
  const stats = await Fee.aggregate([
    {
      $match: { year: matchYearObj }
    },
    {
      $group: {
        _id: '$year',
        numOfFees: { $sum: 1 },
        avgFeesTotal: { $avg: '$total' },
        minFeesTotal: { $min: '$total' },
        maxFeesTotal: { $max: '$total' },
        sumFeesTotal: { $sum: '$total' }
      }
    },
    {
      $sort: {
        _id: -1
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      statistics: stats
    }
  });
});

//@desc         Get all Fees
//@route        GET /api/v1/fees
//@access       Public
// exports.getAllFees = getAllDocs(Fee, {
//   path: 'user property asset',
//   select: 'code total username'
// });
exports.getAllFees = getAllDocs(Fee);

//@desc         Get Single Fee
//@route        GET /api/v1/fees/:id
//@access       Public
exports.getFeeById = getSingleDoc(Fee);

//@desc         Create Fee
//@route        POST /api/v1/fees
//@access       Private
exports.createFee = createDoc(Fee);

//@desc         Update Fee
//@route        PATCHE /api/v1/fees/:id
//@access       Private
//exports.updateFee = updateDoc(Fee);

//@desc         Delete Fee
//@route        DELETE /api/v1/fees/:id
//@access       Private Admin - Manager
exports.deleteFee = deleteDoc(Fee);
