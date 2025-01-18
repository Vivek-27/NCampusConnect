import { useEffect, useRef, useState } from 'react';
import { BiFoodMenu, BiSolidMicrophone } from 'react-icons/bi';
import {
  IoChevronBackOutline,
  IoChevronDownOutline,
  IoCloseOutline,
} from 'react-icons/io5';
import { FiSearch, FiEdit } from 'react-icons/fi';
// import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import useSocket from '../../hooks/useSocket';
import { debounce } from 'lodash';
import { SlRefresh } from 'react-icons/sl';
import io from 'socket.io-client';
import { all_users } from '../../redux/api/UserRequest';

const ChatMenu = ({ setChatMenu }) => {
  // const messages = useOutletContext();

  const [allMessages, setAllMessages] = useState([]);
  const [message, setMessage] = useState();
  const chatContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatWith, setChatWith] = useState(null);

  // URL should be the URL of your backend server
  const socket = io('https://ncampusconnect-1.onrender.com');

  const userData = useSelector((state) => state.authReducer);
  const userId = userData?.authData?.user?._id;

  useEffect(() => {
    if (chatWith && userId) {
      axios
        .get(
          `https://ncampusconnect-1.onrender.com/api/chat/history/${userId}/${chatWith._id}`
        )
        .then((response) => {
          setAllMessages(response.data);
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
              chatContainerRef.current.scrollHeight;
          }
        })
        .catch((error) => {
          console.error('Error fetching chat history:', error.message);
        });
    }
  }, [chatWith, userId]);

  useEffect(() => {
    if (!chatWith && userData?.authData?.user) {
      setChatWith(userData.authData.user);
    }
  }, [chatWith, userData]);

  const { socketMsg } = useSocket(userId);

  useEffect(() => {
    if (socketMsg?.from === chatWith?._id || socketMsg?.to === chatWith?._id) {
      setAllMessages((prev) => [...prev, socketMsg]);
    }
    // setAllMessages((prev) => [...prev, socketMsg]);
  }, [socketMsg]);

  // useEffect(() => {
  //   if (userId) {
  //     // Fetch the latest messages and unread counts
  //     axios
  //       .get(`https://ncampusconnect-1.onrender.com/latest-messages/${userId}`)
  //       .then((res) => console.log(res));
  //   }

  //   // Listen for incoming messages
  //   socket.on('receive_message', (data) => {});
  // }, [chatWith]);

  // Debounced search function to query the backend
  const fetchSearchUsers = debounce(async (query) => {
    try {
      const response = await axios.get(
        `https://ncampusconnect.onrender.com/api/users/getSearchUsers?name=${query}`
      );
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  }, 500); // 500 ms delay after the user stops typing

  const getAllUsers = async () => {
    await all_users().then((data) => {
      setUsers(data.data);
    });
  };
  useEffect(() => {
    if (searchQuery) {
      fetchSearchUsers(searchQuery);
    } else {
      getAllUsers();
    }
  }, [searchQuery]);

  const handleMessageSend = async (e) => {
    e.preventDefault();
    await axios.post(`https://ncampusconnect.onrender.com/api/chat/send`, {
      from: userId,
      to: chatWith._id,
      message: message,
    });
    setMessage('');
    scrollToBottom();
  };

  // Function to detect if the user is at the bottom of the chat
  const checkIfAtBottom = () => {
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    if (scrollHeight - scrollTop === clientHeight) {
      setShowScrollButton(false); // Hide the button if at the bottom
    } else {
      setShowScrollButton(true); // Show the button if not at the bottom
    }
  };

  // Scroll to the bottom when the button is clicked
  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    setShowScrollButton(false); // Hide the button after scrolling to the bottom
  };

  // Update scroll state on scroll
  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    chatContainer.addEventListener('scroll', checkIfAtBottom);

    // Clean up event listener when component unmounts
    return () => {
      chatContainer.removeEventListener('scroll', checkIfAtBottom);
    };
  }, []);

  // Function to auto-resize the textarea height based on content
  const handleResize = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto'; // Reset height to auto to shrink before expanding
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight for expansion
  };

  const Message = ({ from, to, message }) => {
    return (
      <div className="pb-1 ">
        {userId === from ? (
          // Message from the logged-in user
          <div className="flex gap-2 items-end flex-row-reverse">
            <div className="min-h-10 min-w-30 max-w-60 p-2 bg-white/30 rounded-3xl flex rounded-br-none px-4 pr-8 pt-3 pb-2">
              <p className="text-sm text-black/80">{message}</p>
            </div>
          </div>
        ) : (
          // Message from another user
          <div className="flex gap-2 items-end">
            <div className="min-h-10 min-w-30 max-w-60 p-2 bg-blue-500/80 text-white/90 rounded-3xl flex  px-4 pr-8 pt-3 pb-2">
              <p className="text-sm">{message}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        backdropFilter: 'blur(50px)',
      }}
      className="text-black/70 z-50 bg-gradient-to-r from-white/40 to-white/80 my-10 mx-20 overflow-hidden  rounded grid grid-flow-row grid-cols-7 shadow-2xl"
    >
      <div className="left col-span-2 ">
        <div className="top border-b-2 border-white/10 pb-2">
          <div className="top flex justify-between text-black/40 items-center h-20 px-5">
            <BiFoodMenu className=" bg-white/30 h-6 w-6 p-1 rounded-full" />
            <div>
              <h1 className=" text-2xl font-bold text-black/70">Chats</h1>
            </div>
            <FiEdit className=" bg-white/30 h-6 w-6 p-1 rounded-full " />
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="search relative my-1 px-2"
          >
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search"
              className="w-full border-none text-md p-2 placeholder-black/50 outline-none pl-10 bg-white/10 rounded-xl"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                if (users.length > 0) {
                  fetchSearchUsers();
                } else {
                  getAllUsers();
                }
              }}
              className="absolute left-5 top-1/2 transform -translate-y-1/2"
            >
              {Array.isArray(allMessages) && users.length > 0 ? (
                <FiSearch />
              ) : (
                <SlRefresh />
              )}
            </button>
          </form>
        </div>

        <div className="bottom">
          {users.length > 0
            ? users?.map((item, idx) => {
                return (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      setChatWith(item);
                    }}
                    className={`people cursor-pointer hover:bg-white/20 active:bg-white/20 ${
                      chatWith?._id == item._id && 'bg-white/60'
                    }  transition-all duration-100`}
                    key={idx}
                  >
                    <div className="flex h-16 items-center justify-between gap-2 p-2 ">
                      <div className="flex items-center gap-2">
                        <img
                          src={item?.profileImg}
                          alt=""
                          className="w-10 h-10 rounded-full"
                        />
                        <div className=" text-start">
                          <h1 className=" text-sm text-black/80">
                            {item.username}
                          </h1>
                          <p className=" text-xs text-black/60">
                            {item.latestMessage
                              ? item.latestMessage
                              : 'Hey, How are you?'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className=" text-xs text-black/60">12:00 PM</p>
                      </div>
                    </div>
                  </div>
                );
              })
            : 'Users not found'}
        </div>
      </div>
      <div className="right bg-white/10 col-span-5 flex flex-col justify-between ">
        <div className="top flex w-full justify-between items-center px-5 h-16 border-b-2 border-white/10  transition-all duration-300">
          <img
            src={
              chatWith
                ? chatWith?.profileImg
                : userData?.authData?.user?.profileImg
            }
            alt=""
            className="w-10 h-10 rounded-full"
          />{' '}
          {chatWith && (
            <div className=" text-center">
              <h1 className=" text-lg">
                {chatWith._id == userData?.authData?.user?._id
                  ? 'You 🤳'
                  : chatWith?.username}
              </h1>
              <p className=" text-xs text-black/70">
                {chatWith?.following.length} Following{' '}
                {chatWith?.followers.length} Followers
              </p>
            </div>
          )}
          <IoCloseOutline
            onClick={() => setChatMenu(false)}
            className=" text-2xl cursor-pointer text-black/70 hover:text-black/60 active:text-black/40 "
          />
        </div>

        <div
          ref={chatContainerRef}
          className="mid relative w-full h-96 pb-5 px-3 overflow-y-scroll animate-scroll-in-slide scroll-smooth  transition-all duration-100"
        >
          {Array.isArray(allMessages) &&
            allMessages?.length > 0 &&
            allMessages?.map((item, idx) => (
              <Message
                key={idx}
                from={item?.from}
                to={item?.to}
                message={item?.message}
              />
            ))}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className=" fixed top-96 cursor-pointer right-5 text-sm mb-2 bg-white/90 text-black/60 p-2 rounded-full shadow-lg"
            >
              <IoChevronDownOutline />
            </button>
          )}
        </div>
        {/* Bottom input section */}
        <div className="bottom bg-white/20 flex items-center justify-between gap-2 border-t-2 px-3 border-white/10">
          {/* Wrap the input and button inside a form */}
          <form
            onSubmit={handleMessageSend}
            className="w-full flex items-center gap-2"
          >
            <div className="input relative w-full bottom-0 flex items-center justify-between gap-2 px-2">
              {/* Adjust the textarea to grow dynamically */}
              <textarea
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onInput={handleResize} // Trigger resize on input
                placeholder="Type here"
                className="w-full border-none my-1 text-md p-2 placeholder-white outline-none px-4 bg-black/10 rounded-xl resize-none"
                style={{ minHeight: '50px', maxHeight: '150px' }} // Set a minimum height for the textarea
              />
              <i className="absolute right-5 top-1/2 transform -translate-y-1/2">
                <BiSolidMicrophone className=" bg-black/10 rounded-full p-1 h-6 w-6" />
              </i>
            </div>
            {/* Submit button */}
            <button
              type="submit"
              className="bg-white/90 text-black/60 w-20 font-bold h-10 rounded-xl cursor-pointer hover:bg-white/40 active:bg-white"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatMenu;
