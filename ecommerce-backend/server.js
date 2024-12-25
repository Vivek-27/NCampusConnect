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
    origin: 'https://ncampusconnect-1.onrender.com', // Update to your frontend URL if different
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
const notificationRouter = require('./routes/notification');
const chatRouter = require('./routes/chat');
const Message = require('./models/Message');
const Notification = require('./models/Notification');

// Routing
app.use('/api/payment', paymentRoute);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/notifications', notificationRouter);
app.use('/api/chat', chatRouter);

// app.get('/latest-messages/:userId', async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const latestMessages = await Message.aggregate([
//       {
//         $match: {
//           $or: [
//             { from: mongoose.Types.ObjectId(userId) },
//             { to: mongoose.Types.ObjectId(userId) }
//           ]
//         }
//       },
//       { $sort: { timestamp: -1 } },
//       {
//         $group: {
//           _id: {
//             $cond: [
//               { $eq: ['$from', mongoose.Types.ObjectId(userId)] },
//               '$to',
//               '$from'
//             ]
//           },
//           latestMessage: { $first: '$$ROOT' },
//           unreadCount: {
//             $sum: {
//               $cond: [
//                 {
//                   $and: [
//                     { $eq: ['$to', mongoose.Types.ObjectId(userId)] },
//                     { $eq: ['$read', false] }
//                   ]
//                 },
//                 1,
//                 0
//               ]
//             }
//           }
//         }
//       },
//       {
//         $lookup: {
//           from: 'users',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'userDetails'
//         }
//       },
//       { $unwind: '$userDetails' },
//       {
//         $project: {
//           user: '$_id',
//           latestMessage: 1,
//           unreadCount: 1,
//           'userDetails.username': 1,
//           'userDetails.image': 1
//         }
//       }
//     ]);

//     res.json(latestMessages);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching latest messages' });
//   }
// });

// Socket.io connection
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
      type: 'request'
    });

    await newNotification.save();

    // Emit the notification to the user in real-time
    io.to(to).emit('newNotification', newNotification);
  });

  socket.on('newMessage', async (newMessage) => {
    io.to(to).emit('newMessage', newMessage);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
