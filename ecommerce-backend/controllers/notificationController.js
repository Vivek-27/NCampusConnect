const Notification = require('../models/Notification');

const getNotifiaction = async (req, res) => {
  const { userId } = req.params;
  console.warn(userId);

  try {
    const notifications = await Notification.find({ to: userId }).sort({
      createdAt: -1
    }); // Get notifications for the user, sorted by newest first
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

const deleteNotificatio = async (req, res) => {
  const { id } = req.params; // Get the notification ID from the URL parameter

  try {
    // Find the notification by its ID and delete it
    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Respond with the deleted notification (or just a success message)
    res.json({
      message: 'Notification deleted successfully',
      deletedNotification
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getNotifiaction,
  deleteNotificatio
};
