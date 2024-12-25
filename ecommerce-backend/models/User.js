const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String },
    role: { type: String, default: 'buyer' },
    private: { type: Boolean, default: false },
    profileImg: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    },
    country: { type: String },
    city: { type: String },
    about: { type: String },
    phone: { type: Number },
    postalCode: { type: Number },
    sentFriendRequests: [{ type: ObjectId, ref: 'User' }],
    followRequests: [{ type: ObjectId, ref: 'User' }],
    followers: [{ type: ObjectId, ref: 'User' }],
    following: [{ type: ObjectId, ref: 'User' }],
    verificationToken: { type: String },
    isVerified: { type: Boolean, default: false } // For email verification
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
