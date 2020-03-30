const mongoose = require('mongoose');

const _FeeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add fee title'],
      unique: true,
      trim: true
    },
    feeItem: [
      {
        title: {
          type: String,
          required: [true, 'Please add fee item title'],
          unique: true,
          trim: true
        },
        amount: {
          type: Number,
          required: [true, 'Please add amount']
        },
        description: {
          type: String,
          trim: true
        }
      }
    ],
    description: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('_Fee', _FeeSchema);
