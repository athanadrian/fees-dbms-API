const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Make a copy of request query
  const reqQuery = { ...req.query };

  // Register fields to exclude
  const removeFields = ['page', 'sort', 'range', 'fields'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, $lt, $lte, $in)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = model.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  //Sort results by any field or default by createdAt descending
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const range = parseInt(req.query.range, 10) || 10;
  const startIndex = (page - 1) * range;
  const endIndex = page * range;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(range);

  //Execute query with populata fields
  if (populate) {
    query = query.populate(populate);
  }
  // Executing query
  const results = await query;

  // Pagination Result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      range
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      range
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };

  next();
};

module.exports = advancedResults;
