const express = require('express');
const {
  getNotifiaction,
  deleteNotificatio,
} = require('../controllers/notificationController');
const router = express.Router();

router.get('/:userId', getNotifiaction);
router.delete('/delete/:id', deleteNotificatio);

module.exports = router;
