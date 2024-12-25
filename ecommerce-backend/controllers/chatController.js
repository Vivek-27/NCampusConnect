const Message = require('../models/Message');

const sendMessage = async (req, res) => {
  const { from, to, message } = req.body;

  try {
    const newMessage = new Message({ from, to, message });
    await newMessage.save();
    // Emit the message via socket (socket will handle saving)
    req.app.get('io').emit('newMessage', newMessage);

    res.status(200).send('Message sent');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending message');
  }
};

// Function to fetch chat history between two users
const getChatHistory = async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching chat history');
  }
};

module.exports = {
  sendMessage,
  getChatHistory
};
