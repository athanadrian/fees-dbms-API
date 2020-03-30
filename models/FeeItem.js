const mongoose = require('mongoose');

const FeeItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add title']
  },
  amount: {
    type: Number,
    default: 0
  },
  remarks: {
    type: String
  }
});

module.exports = mongoose.model('FeeItem', FeeItemSchema);
