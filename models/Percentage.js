const mongoose = require('mongoose');
const slugify = require('slugify');

const PercentageSchema = new mongoose.Schema({
  setupCode: {
    type: String,
    required: [true, 'Please add title for set up'],
    unique: true,
    trim: true
  },
  slug: String,
  percentageItems: {
    type: Array,
    default: []
  },
  total: Number,
  isActive: {
    type: Boolean,
    default: true
  },
  startedAt: {
    type: Date
  },
  endedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
PercentageSchema.pre('save', function(next) {
  this.slug = slugify(this.setupCode, { lower: true });
  next();
});

PercentageSchema.pre('save', function(next) {
  this.total = this.percentageItems.reduce((acc, curr) => {
    acc += curr.amount;
    return acc;
  }, 0);
  next();
});

module.exports = mongoose.model('Percentage', PercentageSchema);
