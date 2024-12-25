const express = require('express');
const {
  createOrder,
  getOrderById,
  getOrders,
  updateOrder,
  deleteOrder
} = require('../controllers/orderController');
const router = express.Router();

router.post('/orders', createOrder);

router.get('/orders/:orderId', getOrderById);

router.get('/orders', getOrders);

router.put('/orders/:orderId', updateOrder);

router.delete('/orders/:orderId', deleteOrder);

module.exports = router;
