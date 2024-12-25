const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    type: { type: String, required: true }, // e.g., 'request', 'accept', 'deny'
    isRead: { type: Boolean, default: false },
    profileImg: {
      type: String
    }
  },

  { timestamps: true }
);

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
