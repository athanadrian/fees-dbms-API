const mongoose = require('mongoose');
//const Percentage = require('../models/Percentage');
//const Fee = require('../models/Fee');

const PropertySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please add title'],
      unique: true,
      trim: true
    },
    configuration: {
      DEH: {
        type: String,
        trim: true
      },
      WATER: {
        type: String,
        trim: true
      },
      KAE: {
        type: String,
        trim: true
      }
    },
    debt: {
      type: Number,
      default: 0
    },
    personsCharged: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    location: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number], // lng(V), lat)(H) with this order
      address: String,
      description: String
    },
    feesTotal: {
      type: Number,
      default: 0
    },
    feesAverage: {
      type: Number,
      default: 0
    },
    feesQuantity: {
      type: Number,
      default: 0
    },
    paymentsTotal: {
      type: Number,
      default: 0
    },
    paymentsAverage: {
      type: Number,
      default: 0
    },
    paymentsQuantity: {
      type: Number,
      default: 0
    },
    percentage: {
      type: mongoose.Schema.ObjectId,
      ref: 'Percentage'
    },
    paymentsHistory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Payment'
      }
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    asset: {
      type: mongoose.Schema.ObjectId,
      ref: 'Asset',
      required: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Reverse populate with virtuals fees
PropertySchema.virtual('fees', {
  ref: 'Fee',
  foreignField: 'property',
  localField: '_id',
  justOne: false
});

PropertySchema.pre(/^find/, function(next) {
  this.populate({
    path: 'fees',
    select: 'title total'
  });
  next();
});

// PropertySchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'feesHistory',
//     select: '-__v'
//   });
//   next();
// });

// PropertySchema.pre('save', async function(next) {
//   const feesPromises = this.feesHistory.map(async id => await Fee.findById(id));
//   this.feesHistory = await Promise.all(feesPromises);
//   next();
// });

module.exports = mongoose.model('Property', PropertySchema);
