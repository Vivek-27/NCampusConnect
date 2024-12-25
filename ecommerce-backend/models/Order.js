const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'canceled', 'returned'],
      default: 'pending'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    totalPrice: {
      type: Number,
      required: true
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['credit card', 'paypal', 'bank transfer'],
      required: true
    },
    shippedDate: Date,
    deliveredDate: Date,
    orderNotes: String,
    discount: {
      type: Number,
      default: 0
    },
    transactionId: String,
    refundStatus: {
      type: String,
      enum: ['not_requested', 'requested', 'approved', 'denied'],
      default: 'not_requested'
    },
    refundAmount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
