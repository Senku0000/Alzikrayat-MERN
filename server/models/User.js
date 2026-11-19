const mongoose = require('mongoose');

/**
 * User.js
 *
 * Mongoose schema for registered users. Passwords are always stored
 * as a bcrypt hash (never plain text) and are stripped out of any
 * JSON response via the toJSON transform below.
 */
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'], // always a bcrypt hash
    },
    location: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    occupation: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

// Never leak the password hash to the client, even by accident.
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
