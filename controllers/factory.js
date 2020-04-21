const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const AdvancedClassResults = require('../middleware/advancedClassResults');

//@desc         Create Model
//@route        POST /api/v1/(models)
//@access       Private Admin - Manager - User (depends on Authorize)
exports.createDoc = Model =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

//@desc         Get all Models
//@route        GET /api/v1/(models)
//@access       Private - Admin
exports.getAllDocs = Model =>
  asyncHandler(async (req, res, next) => {
    // A hack to allow nested routes for:
    // 1. Create a propertry to an Asset.
    // 2. Get all Asset's properties.
    // 3. Get all Asset's fees.
    let filter = {};
    if (req.params.assetId) filter = { asset: req.params.assetId };
    if (req.params.propertyId) filter = { property: req.params.propertyId };
    if (req.params.userId) filter = { user: req.params.userId };

    const promiseDocs = new AdvancedClassResults(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await promiseDocs.query;

    const results = docs.length;
    res.set('Content-Range', `${results}`);
    res.status(200).json({
      status: 'success',
      results,
      data: {
        data: docs
      }
    });
  });

//@desc         Get Single Model (with custom populate options)
//@route        GET /api/v1/(models)/:id
//@access       Private Admin - Manager - User (depends on Authorize)
exports.getSingleDoc = (Model, popOptions) =>
  asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new ErrorResponse('Document does not exist.', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

//@desc         Update Model
//@route        PATCHE /api/v1/(models)/:id
//@access       Private Admin - Manager - User (depends on Authorize)
exports.updateDoc = Model =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(new ErrorResponse('Document does not exist!', 404));
    }
    res.status(200).json({
      //200 status OK with Data
      status: 'success',
      message: 'Document updated',
      data: {
        data: doc
      }
    });
  });

//@desc         Delete Model
//@route        DELETE /api/v1/models/:id
//@access       Private Admin - Manager - User (depends on Authorize)
exports.deleteDoc = Model =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new ErrorResponse(`Document does not exist!`, 404));
    }
    res.status(204).json({
      //204 status OK but no Data
      status: 'success',
      message: 'Fee deleted!',
      data: null
    });
  });
