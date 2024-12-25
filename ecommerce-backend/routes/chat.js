const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getChatHistory,
} = require('../controllers/chatController');

router.post('/send', sendMessage);
router.get('/history/:user1/:user2', getChatHistory);

module.exports = router;
