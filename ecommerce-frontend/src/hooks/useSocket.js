import { useEffect, useState } from 'react';
import io from 'socket.io-client';

// URL should be the URL of your backend server
const socket = io('https://ncampusconnect.onrender.com');

const useSocket = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (!userId) return; // Don't establish a socket connection if userId is null or undefined

    // Join the room when the component mounts
    socket.emit('joinRoom', userId);

    // Listen for new notifications
    socket.on('newNotification', (notification) => {
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications
      ]);
    });

    // Listen for new messages
    socket.on('newMessage', (message) => {
      setMessages(message);
      setUnreadMessages((prevUnread) => prevUnread + 1); // Increment unread message count
    });

    return () => {
      socket.off('newNotification');
      socket.off('newMessage');
    };
  }, [userId]);

  const sendMessage = (messageData) => {
    if (!userId) return; // Don't send messages if user is not logged in
    socket.emit('newMessage', messageData); // Send the message through the socket
  };

  return { notifications, socketMsg: messages, unreadMessages, sendMessage };
};

export default useSocket;
