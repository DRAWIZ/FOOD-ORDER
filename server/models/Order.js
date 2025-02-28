const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      },
      name: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  tokenNumber: {
    type: String,
    required: true,
    default: function() {
      return uuidv4().substring(0, 8).toUpperCase();
    }
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'preparing', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);