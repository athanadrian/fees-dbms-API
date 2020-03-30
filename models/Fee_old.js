const mongoose = require('mongoose');

//const { ObjectId } = mongoose.Schema;

const FeeSchema = new mongoose.Schema(
  {
    title: {
      type: String
      //requirerd: true
    },
    month: {
      type: String,
      required: [true, 'Please add month']
    },
    year: {
      type: String,
      required: [true, 'Please add year']
    },
    sewage: {
      type: Number,
      default: 0
    },
    water: {
      type: Number,
      default: 0
    },
    electric: {
      type: Number,
      default: 0
    },
    extraAll: {
      type: Number,
      default: 0
    },
    extraPool: {
      type: Number,
      default: 0
    },
    garden: {
      type: Number,
      default: 0
    },
    pool: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    isPublished: false,
    remarks: {
      type: String
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
  { year: 1, month: 1 },
  { unique: [true, `Fee ${this.month}-${this.year}, already exists`] }
);

FeeSchema.pre('save', function(next) {
  this.title = `${this.month}-${this.year}`.toLowerCase();
  this.total =
    this.sewage +
    this.water +
    this.pool +
    this.garden +
    this.electric +
    this.extraAll +
    this.extraPool;
  next();
});

module.exports = mongoose.model('Fee', FeeSchema);
