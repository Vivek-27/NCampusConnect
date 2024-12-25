import { LuSettings2 } from 'react-icons/lu';
import { RxCross2 } from 'react-icons/rx';
import React, { useEffect, useState } from 'react';
import useSocket from '../../hooks/useSocket';
import io from 'socket.io-client';
import axios from 'axios';
import { getUser } from '../../redux/api/UserRequest';
import { useDispatch } from 'react-redux';
import {
  acceptFollowRequest,
  denyFollowRequest,
  updatedUserDetails,
  updateUser
} from '../../redux/actions/UserAction';

// Forward ref to allow external components to interact with the Notifications component's DOM

const Notifications = React.forwardRef((props, ref) => {
  const user = JSON.parse(localStorage?.getItem('profile'));
  const userId = user?._id;
  const [notifications, setNotifications] = useState([]);

  const socketNotifications = useSocket(userId); // Using the custom hook for socket notifications
  const dispatch = useDispatch();

  useEffect(() => {
    // Update the notifications list when socket notifications are received
    if (socketNotifications && socketNotifications.length) {
      setNotifications((prevNotifications) => [
        ...socketNotifications,
        ...prevNotifications
      ]);
    }
  }, [socketNotifications]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `https://ncampusconnect.onrender.com/api/notifications/${userId}`
        );
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    fetchNotifications();
  }, [userId]);

  const Message = ({ notification }) => {
    const { message, type, status, from, createdAt, profileImg } = notification;
    const [user, setUser] = useState('');
    useEffect(() => {
      getUser(from).then((data) => {
        setUser(data?.data);
      });
    }, [from]);

    const deleteNotification = async () => {
      try {
        // Delete the notification from the server
        await axios.delete(
          `https://ncampusconnect.onrender.com/api/notifications/delete/${_id}`
        );

        // Remove the notification from the local state (UI)
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notiId) => notiId._id !== _id)
        );
      } catch (err) {
        console.error('Failed to delete notification', err);
        alert('Failed to delete notification');
      }
    };
    return (
      <div className="mx-1 px-3 my-2 py-4 flex justify-between gap-2 animate-fade-in-slide rounded-xl bg-gray-100 hover:bg-gray-200 transition-all">
        <div>
          <img
            src={profileImg}
            alt=""
            className="rounded-full w-7 bg-yellow-200 object-contain h-7"
          />
          <div>
            <p className="text-sm text-gray-600">
              {user.firstname} {user.lastname} {message}
            </p>
            <span className="text-xs text-gray-500 font-medium">
              {createdAt}
            </span>
            {type === 'request' && (
              <div className="flex gap-2 mt-2 h-7">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(denyFollowRequest(from));
                  }}
                  className="text-xs bg-gray-200 border px-6 py-1 rounded-lg text-gray-600"
                >
                  Deny
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(acceptFollowRequest(from));
                  }}
                  className="text-xs bg-sky-500 px-6 py-1 rounded-lg text-white"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="">
          <RxCross2
            onClick={deleteNotification}
            className="text-xl cursor-pointer p-1 bg-red-400 rounded-full text-white"
          />
        </div>
      </div>
    );
  };

  return (
    <div
      ref={ref}
      style={{ background: '#fcfcfb' }}
      className="absolute top-20 right-5 w-96 border-gray-200 border-2 shadow-xl rounded-2xl pt-3 overflow-hidden animate-scroll-in-slide"
    >
      <div className="flex w-full items-center justify-between px-4">
        <p className="text-md font-semibold text-gray-600">Notifications</p>
        <p className="text-xs text-gray-500 font-medium">Mark all as read</p>
      </div>

      <div className="flex border-b-2 border-gray-100 px-5 text-sm text-gray-500 py-1 mt-3">
        <div className="flex gap-4 w-full items-center">
          <p>Inbox</p>
          <p>Following</p>
          <p>All</p>|<p>Archived</p>
        </div>
        <LuSettings2 />
      </div>

      <div className="pt-3 overflow-hidden overflow-y-scroll h-96">
        {notifications.map((notification, index) => (
          <div key={index} className="notification">
            <Message notification={notification} />
          </div>
        ))}
      </div>
    </div>
  );
});

Notifications.displayName = 'Notifications';

export default Notifications;
