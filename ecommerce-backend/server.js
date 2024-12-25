const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
const corsOptions = {
  origin: 'https://ncampusconnect-1.onrender.com', // Make sure to update this with the actual frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Allow credentials (cookies) to be sent with requests
};

// Middleware
app.use(cors(corsOptions)); // Use the configured CORS options
app.use(express.json()); // Built-in Express middleware for parsing JSON bodies
app.use(cookieParser());

// Create HTTP server and initialize Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', // Update to your frontend URL if different
    methods: ['GET', 'POST'],
    credentials: true // Ensure cookies can be sent with WebSocket connections
  }
});
// Pass `io` to routes or controllers
app.set('io', io);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Import routes
const userRoutes = require('./routes/user');
const itemRoutes = require('./routes/item');
const paymentRoute = require('./routes/payment');
const Notification = require('./models/Notification');

// Routing
app.use('/api/payment', paymentRoute);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);

// Socket.io connection for notifications
io.on('connection', (socket) => {
  console.log('A user connected');

  // Join the room corresponding to the userId (used for sending targeted notifications)
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('newRequest', async (requestData) => {
    const { from, to, message } = requestData;

    // Save the notification to the database
    const newNotification = new Notification({
      from,
      to,
      message,
      type: 'request' // This could be customized to other types (e.g., 'message')
    });

    await newNotification.save();

    // Emit the notification to the user in real-time
    io.to(to).emit('newNotification', newNotification);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Express route to fetch notifications
app.get('/api/notifications/:userId', async (req, res) => {
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
});

app.delete('/api/notifications/delete/:id', async (req, res) => {
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
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
