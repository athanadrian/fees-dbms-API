const Asset = require('../models/Asset');
const {
  createDoc,
  getAllDocs,
  getSingleDoc,
  updateDoc,
  deleteDoc
} = require('./factory');
const asyncHandler = require('../utils/asyncHandler');

//@desc         Get Asset dbms statistics
//@route        GET /api/v1/asset-stats
//@access       Private
exports.getAssetStats = asyncHandler(async (req, res, next) => {
  // const { year } = req.query;
  // let matchYearObj;
  // if (!year) {
  //   matchYearObj = { $gte: '2017' };
  // } else {
  //   matchYearObj = { $eq: year };
  // }
  // const stats = await Asset.aggregate([
  //   {
  //     $match: { year: matchYearObj }
  //   },
  //   {
  //     $group: {
  //       _id: '$year',
  //       numOfAssets: { $sum: 1 },
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

//@desc         Get all Assets
//@route        GET /api/v1/Assets
//@access       Private - Admin
exports.getAllAssets = getAllDocs(Asset);

//@desc         Get Single Asset
//@route        GET /api/v1/assets/:id
//@access       Private Admin
exports.getAssetById = getSingleDoc(Asset, { path: 'properties fees' });

//@desc         Create Asset
//@route        POST /api/v1/assets
//@access       Private
exports.createAsset = createDoc(Asset);

//@desc         Update Asset
//@route        PATCHE /api/v1/assets/:id
//@access       Private
exports.updateAsset = updateDoc(Asset);

//@desc         Delete Asset
//@route        DELETE /api/v1/assets/:id
//@access       Private
exports.deleteAsset = deleteDoc(Asset);
