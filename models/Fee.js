const mongoose = require('mongoose');
const Asset = require('../models/Asset');
const Property = require('../models/Property');
const User = require('../models/User');

const FeeSchema = new mongoose.Schema(
  {
    title: {
      type: String
    },
    month: {
      type: String,
      required: [true, 'Please add month']
    },
    year: {
      type: String,
      required: [true, 'Please add year']
    },
    feeItems: {
      type: Array,
      default: []
    },
    total: Number,
    isPublished: false,
    remarks: {
      type: String
    },
    asset: {
      type: mongoose.Schema.ObjectId,
      ref: 'Asset',
      require: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    property: {
      type: mongoose.Schema.ObjectId,
      ref: 'Property'
    },
    percentage: {
      type: mongoose.Schema.ObjectId,
      ref: 'Percentage'
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

FeeSchema.index(
  { year: 1, month: 1, user: 1, property: 1 },
  { unique: [true, `Fee ${this.month}-${this.year}, already exists`] }
);

// Calculate Sum - Average - Quantity of Fees for the Asset
FeeSchema.statics.calculateModelFeesStats = async function(Model, id) {
  let filter;
  let _id = '';
  if (Model === Asset) {
    filter = { asset: id };
    _id = '$asset';
  }
  if (Model === Property) {
    filter = { property: id };
    _id = '$property';
  }
  if (Model === User) {
    filter = { user: id };
    _id = '$user';
  }
  const stats = await this.aggregate([
    {
      $match: filter
    },
    {
      $group: {
        _id: _id,
        numOfFees: { $sum: 1 },
        totalSumFees: { $sum: '$total' },
        avgFees: { $avg: '$total' }
      }
    }
  ]);
  //console.log('stats', stats);
  if (stats.length > 0) {
    await Model.findByIdAndUpdate(id, {
      feesQuantity: stats[0].numOfFees,
      feesTotal: stats[0].totalSumFees,
      feesAverage: Math.ceil(stats[0].avgFees / 10) * 10
    });
  } else {
    await Model.findByIdAndUpdate(id, {
      feesQuantity: 0,
      feesTotal: 0,
      feesAverage: 0
    });
  }
};

FeeSchema.post('save', function() {
  this.constructor.calculateModelFeesStats(Asset, this.asset);
  this.constructor.calculateModelFeesStats(Property, this.property);
  this.constructor.calculateModelFeesStats(User, this.user);
  //next();
});

FeeSchema.pre(/^findOneAnd/, async function(next) {
  this.f = await this.findOne();
  next();
});

FeeSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); does NOT work here, query has already executed
  await this.f.constructor.calculateModelFeesStats(this.f.asset);
  await this.f.constructor.calculateModelFeesStats(this.f.property);
  await this.f.constructor.calculateModelFeesStats(this.f.user);
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
FeeSchema.pre('save', function(next) {
  this.title = `${this.month}-${this.year}`.toLowerCase();
  this.total = this.feeItems.reduce((acc, curr) => {
    acc += curr.amount;
    return acc;
  }, 0);
  next();
});

// FeeSchema.pre(/^findOneAnd/, async function(next) {
//   this.total = this.feeItems.reduce((acc, curr) => {
//     acc += curr.amount;
//     return acc;
//   }, 0);
//   next();
// });

// DOCUMENT MIDDLEWARE: runs before save
// FeeSchema.pre('remove', function(next) {
//   this.title = `${this.month}-${this.year}`.toLowerCase();
//   this.total = this.feeItems.reduce((acc, curr) => {
//     acc += curr.amount;
//     return acc;
//   }, 0);
//   next();
// });

// FeeSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'user'
//     // ,
//     // select: '-__v'
//   });
//   next();
// });

module.exports = mongoose.model('Fee', FeeSchema);
