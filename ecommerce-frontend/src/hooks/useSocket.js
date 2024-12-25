import { useEffect, useState } from 'react';
import io from 'socket.io-client';

// URL should be the URL of your backend server
const socket = io('http://localhost:5000');

const useSocket = (userId) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Join the room when the component mounts
    socket.emit('joinRoom', userId);

    // Listen for new notifications
    socket.on('newNotification', (notification) => {
      // Add the new notification at the top of the array
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications
      ]);
    });

    return () => {
      socket.off('newNotification'); // Clean up on unmount
    };
  }, [userId]);

  return notifications;
};

export default useSocket;
