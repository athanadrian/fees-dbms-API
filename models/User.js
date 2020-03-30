const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Please add a user name'],
      maxlength: [32, 'Name can not exceed 32 characters']
    },
    firstname: {
      type: String,
      trim: true,
      maxlength: [32, 'Name can not exceed 32 characters']
    },
    lastname: {
      type: String,
      trim: true,
      maxlength: [32, 'Name can not exceed 32 characters']
    },
    phone: {
      home: {
        type: Number,
        trim: true
      },
      mobile: {
        type: Number,
        trim: true
      }
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please add a valid email']
      // match: [
      //   /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      //   "Please add a valid email"
      // ]
    },
    photo: String,
    role: {
      type: String,
      required: [true, 'A user must have a role.'],
      enum: {
        values: ['resident', 'manager', 'admin'],
        message: "User's role is either resident, manager, admin"
      },
      default: 'resident'
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      select: false,
      validate: {
        // This works on CREATE and SAVE
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isOwner: {
      type: Boolean,
      default: false,
      select: true
    },
    isActive: {
      type: Boolean,
      default: true,
      select: true
    },
    debt: {
      type: Number,
      default: 0
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
    createdAt: {
      type: Date,
      default: Date.now
    },
    // feesHistory: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Fee'
    //   }
    // ],
    paymentsHistory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Payment'
      }
    ],
    property: {
      type: mongoose.Schema.ObjectId,
      ref: 'Property'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Reverse populate with virtuals fees
UserSchema.virtual('fees', {
  ref: 'Fee',
  foreignField: 'user',
  localField: '_id',
  justOne: false
});

UserSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'fees',
    select: 'title total'
  });
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if a user has changed password after he logged in
UserSchema.methods.changedPasswordAfterLogin = function(JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changeTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); // convert it from ms to s

    return JWTTimeStamp < changeTimeStamp;
  }
  // false means NOT changed password
  return false;
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // +10 min * 60 ->sec * 1000 ->ms

  return resetToken;
};

// Encrypt password using bcryptjs
UserSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

UserSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  // Save timestamp of password changed and add 1000ms to be sure of the delay to store it in DB
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// UserSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'feesHistory',
//     select: '-__v'
//   });
//   next();
// });
// Get all users that their active is not set toy false
// UserSchema.pre('find', function(next) {
//   // this points to the current query
//   this.find({ isActive: { $ne: false } });
//   next();
// });

module.exports = mongoose.model('User', UserSchema);
