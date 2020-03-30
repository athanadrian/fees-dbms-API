const mongoose = require('mongoose');
//const Property = require('../models/Property');

const AssetSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please add title'],
      unique: true,
      trim: true
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
      address: String
    },
    description: String,
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
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Reverse populate with virtuals properties
AssetSchema.virtual('properties', {
  ref: 'Property',
  foreignField: 'asset',
  localField: '_id',
  justOne: false
});

//Reverse populate with virtuals fees
AssetSchema.virtual('fees', {
  ref: 'Fee',
  foreignField: 'asset',
  localField: '_id',
  justOne: false
});

AssetSchema.pre('find', function(next) {
  this.populate({
    path: 'properties fees',
    select: 'code debt title total'
  });
  next();
});
// AssetSchema.pre('save', async function(next) {
//   const propertiesPromises = this.properties.map(async id => await Property.findById(id));
//   this.properties = await Promise.all(propertiesPromises);
//   next();
// });
module.exports = mongoose.model('Asset', AssetSchema);
