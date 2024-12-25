const Order = require('../models/Order'); // Assuming your order schema is in models/Order
const mongoose = require('mongoose');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      item,
      buyer,
      status,
      quantity,
      totalPrice,
      shippingAddress,
      paymentMethod,
      orderNotes,
      discount,
      transactionId
    } = req.body;

    const newOrder = new Order({
      item,
      buyer,
      status: status || 'pending',
      quantity,
      totalPrice,
      shippingAddress,
      paymentMethod,
      orderNotes,
      discount,
      transactionId
    });

    // Save the new order to the database
    const savedOrder = await newOrder.save();
    res
      .status(201)
      .json({ message: 'Order created successfully', order: savedOrder });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error creating order', error: err.message });
  }
};

// Get a single order by its ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if the order exists
    const order = await Order.findById(orderId)
      .populate('item')
      .populate('buyer');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching order', error: err.message });
  }
};

// Get all orders for a buyer (or all orders if no buyer is specified)
exports.getOrders = async (req, res) => {
  try {
    const { buyerId } = req.query; // Optionally filter by buyerId

    let orders;
    if (buyerId) {
      orders = await Order.find({ buyer: buyerId }).populate('item');
    } else {
      orders = await Order.find().populate('item').populate('buyer');
    }

    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching orders', error: err.message });
  }
};

// Update an order (e.g., update status, payment status)
exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updates = req.body;

    // Ensure the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, {
      new: true
    });
    res
      .status(200)
      .json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error updating order', error: err.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Ensure the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Delete the order
    await order.remove();
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error deleting order', error: err.message });
  }
};
