class AdvancedClassResults {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // BUILD QUERY
    // 1Α) Filtering
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'range', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);

    // 1Β) Advanced Filtering
    // $lte - $lt - $gte - $gt
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(lte|lt|gte|gt)\b/g, match => `$${match}`);
    // \b->the exact word(lte,lt....) before and after
    // g ->do the same thing multiple times

    this.query.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    // 2) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    // 3) Fields Limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // 4) Pagination
    const page = this.queryString.page * 1 || 1;
    const range = this.queryString.range * 1 || 100; // multiply *1 to convert string to integer
    const skip = (page - 1) * range;
    // multiply previus page with items(range) to find how many items we have to skip
    // so from where to start your page
    // we need to go to p2 and skip the first 10 items that are listed in p1
    // p1->1-10, p2->11-20, p3->21-30, ....
    this.query = this.query.skip(skip).limit(range);

    return this;
  }
}
module.exports = AdvancedClassResults;
