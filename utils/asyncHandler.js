const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;

// module.exports = fn => {
//   // because of the fn that is raps async function that returns another anonymus function that
//   // returns a promise, we catch the error here and not to the async block function with tryCatch
//   return (req, res, next) => {
//     fn(req, res, next).catch(next); // or .catch(err=>next(err));
//   };
// };
