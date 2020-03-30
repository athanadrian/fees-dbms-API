const User = require('../models/User');
const Property = require('../models/Property');
const Percentage = require('../models/Percentage');
const { getAllDocs, getSingleDoc, updateDoc, deleteDoc } = require('./factory');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const calculateFee = require('../utils/calculateFee');

const filterObjFields = (obj, ...allowFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach(field => {
    if (allowFields.includes(field)) filteredObj[field] = obj[field];
  });
  return filteredObj;
};

exports.getMe = asyncHandler(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

//@desc         Get Calculated User Fees
//@route        GET /api/v1/users/:id/fees
//@access       Private - User
exports.getCalculatedUserFees = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse('User does not exist.', 404));
  }
  const property = await Property.findById(user.property);
  const percentage = await Percentage.findById(property.percentage);
  const userFees = user.feesHistory.map(fee => {
    fee.feeItems = calculateFee(percentage.percentageItems, fee.feeItems);
    return fee;
  });
  res.status(200).json({
    status: 'success',
    results: userFees.length,
    data: {
      user
    }
  });
});

//@desc         Update User Details
//@route        PATCH /api/v1/users/updateMe
//@access       Private
exports.updateUserDetails = asyncHandler(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new ErrorResponse(
        'You should not try to change password form here. Use the appropriate proccedure.',
        404
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObjFields(
    req.body,
    'username',
    'firstname',
    'lastname',
    'email',
    'phone.home',
    'phone.mobile'
  );
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });
  if (!user) {
    return next(new ErrorResponse('User does not exist.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

//@desc         Delete(DeActivate- User) User Password
//@route        PATCH /api/v1/users/deactivate-user/:id
//@access       Private - Admin
exports.deActivateUser = asyncHandler(async (req, res, next) => {
  // Do not allow to delete(de-activate current user account)
  if (req.user.id === req.params.id) {
    return next(
      new ErrorResponse('You are not allowed for this action in your account.', 400)
    );
  }
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false });
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (!user.role === 'admin') {
    return next(new ErrorResponse('You are not authorized for this action.', 400));
  }

  res.status(204).json({
    status: 'success'
  });
});

//@desc         Restore(ReActivate- User) User Password
//@route        PATCH /api/v1/users/restore-user/:id
//@access       Private - Admin
exports.restoreUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: true },
    { new: true }
  );
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (!user.role === 'admin') {
    return next(new ErrorResponse('You are not authorized for this action.', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

//@desc         Get all Users
//@route        GET /api/v1/users
//@access       Private - Admin - Manager
exports.getAllUsers = getAllDocs(User);

//@desc         Get Single User
//@route        GET /api/v1/users/:id
//@access       Public
exports.getUserById = getSingleDoc(User);
exports.updateUser = updateDoc(User);
exports.deleteUser = deleteDoc(User);
