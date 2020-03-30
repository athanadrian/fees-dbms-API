const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    trim: true
  },
  amount: {
    type: Number,
    default: 0
  },
  remarks: {
    type: String,
    trim: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  publishedAt: {
    type: Date
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.ObjectId,
    ref: 'Property',
    required: true
  },
  fee: {
    type: mongoose.Schema.ObjectId,
    ref: 'Fee'
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);
