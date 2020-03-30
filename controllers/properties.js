const Property = require('../models/Property');
const Percentage = require('../models/Percentage');
const {
  createDoc,
  getAllDocs,
  getSingleDoc,
  updateDoc,
  deleteDoc
} = require('./factory');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const calculateFee = require('../utils/calculateFee');

//@desc         Get Calculated Property Fees
//@route        GET /api/v1/properties/:id/fees
//@access       Private - User
exports.getPropertyFees = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return next(new ErrorResponse('Property does not exist.', 404));
  }

  const percentage = await Percentage.findById(property.percentage);
  const propertyFees = property.feesHistory.map(fee => {
    fee.feeItems = calculateFee(percentage.percentageItems, fee.feeItems);
    return fee;
  });
  res.status(200).json({
    status: 'success',
    results: propertyFees.length,
    data: {
      propertyFees
    }
  });
});

//@desc         Get all Propertys
//@route        GET /api/v1/Propertys
//@access       Private - Admin
exports.getAllProperties = getAllDocs(Property);

//@desc         Get Single Property
//@route        GET /api/v1/properties/:id
//@access       Private Admin
exports.getPropertyById = getSingleDoc(Property);

//@desc         Create Property
//@route        POST /api/v1/properties
//@access       Private
exports.createProperty = createDoc(Property);

//@desc         Update Property
//@route        PATCHE /api/v1/properties/:id
//@access       Private
exports.updateProperty = updateDoc(Property);

//@desc         Delete Property
//@route        DELETE /api/v1/properties/:id
//@access       Private
exports.deleteProperty = deleteDoc(Property);

//@desc         Get Property dbms statistics
//@route        GET /api/v1/propertie-stats
//@access       Private
exports.getPropertyStats = asyncHandler(async (req, res, next) => {
  // const { year } = req.query;
  // let matchYearObj;
  // if (!year) {
  //   matchYearObj = { $gte: '2017' };
  // } else {
  //   matchYearObj = { $eq: year };
  // }
  // const stats = await Property.aggregate([
  //   {
  //     $match: { year: matchYearObj }
  //   },
  //   {
  //     $group: {
  //       _id: '$year',
  //       numOfPropertys: { $sum: 1 },
  //       avgFeesTotal: { $avg: '$total' },
  //       minFeesTotal: { $min: '$total' },
  //       maxFeesTotal: { $max: '$total' },
  //       sumFeesTotal: { $sum: '$total' }
  //     }
  //   },
  //   {
  //     $sort: {
  //       _id: -1
  //     }
  //   }
  // ]);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     statistics: stats
  //   }
  // });
});
