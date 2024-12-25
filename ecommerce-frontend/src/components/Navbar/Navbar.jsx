import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IoIosSearch, IoMdNotifications } from 'react-icons/io';
import { MdManageAccounts } from 'react-icons/md';
import { PiPackageFill } from 'react-icons/pi';
import { MdOutlineSupport } from 'react-icons/md';
import { LuLanguages } from 'react-icons/lu';
import { CgLogOut } from 'react-icons/cg';
import { FcAbout } from 'react-icons/fc';
import { FcAdvertising } from 'react-icons/fc';
import { CiShoppingCart } from 'react-icons/ci';
import LogoutBanner from '../../utils/LogoutBanner';
import Notifications from '../Notifications/Notifications';
import useClickOutside from '../../hooks/useClickOutside';
import useSocket from '../../hooks/useSocket';
import axios from 'axios';
import { debounce } from 'lodash';

const Navbar = () => {
  const navigations = [
    { label: 'Home', href: '/' },
    { label: 'Explore', href: '/explore' },
    { label: 'Categories', href: '/categories' },
    { label: 'Feed', href: '/blog' },
    { label: 'Contacts', href: '/contact' }
  ];

  const userData = useSelector((state) => state.authReducer);
  const user = userData?.authData?.user;
  const [profileOptions, setProfileOptions] = useState(false);
  const [logoutMenu, setLogoutMenu] = useState(false);
  const [notificationPanal, setNotificationPanal] = useState(false);
  const cartItems = useSelector((state) => state.cartReducer.items);

  const logoutMenuHandler = () => {
    setLogoutMenu((state) => !state);
  };

  const naviagte = useNavigate();
  const location = useLocation();

  // Refs for the profile and notification panels
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const searchResultRef = useRef(null);

  const handleProfileOptionsClose = () => {
    setProfileOptions(false);
  };
  const handleNotificationPanalClose = () => {
    setNotificationPanal(false);
  };
  const handleProductsClose = () => {
    setProducts([]);
  };
  // Using custom hook for handling clicks outside
  useClickOutside(notificationRef, handleNotificationPanalClose);
  useClickOutside(searchResultRef, handleProductsClose);
  useClickOutside(profileRef, handleProfileOptionsClose);

  const [notifications, setNotifications] = useState([]);

  const socketNotifications = useSocket(user?._id); // Using the custom hook for socket notifications

  useEffect(() => {
    // Update the notifications list when socket notifications are received
    if (socketNotifications && socketNotifications.length) {
      setNotifications(socketNotifications);
    }
  }, [socketNotifications]);

  const ProfileOptoins = () => (
    <div
      style={{ background: '#fcfcfb' }}
      className="border-2 border-gray-200 rounded-xl mt-2 absolute z-20 right-0 w-72 pt-3 overflow-hidden shadow-xl hover:shadow-2xl animate-menu-slide"
    >
      <div className="flex w-full items-center justify-between px-4 ">
        <p className="text-md font-semibold text-gray-600">Profile</p>
        <p className="text-xs text-gray-500 font-medium">Settings</p>
      </div>
      <ul className="flex flex-col gap-2 w-72 text-sm font-thin items-center text-center py-3 overflow-y-scroll">
        <li
          onClick={(e) => {
            e.preventDefault(); // Prevent any default behavior here
            naviagte('account/profile');
            setProfileOptions(false);
          }}
          className="flex gap-2 items-center cursor-pointer w-full px-5 py-2"
        >
          <MdManageAccounts className="text-3xl" />
          <p className="text-gray-700">Account</p>
        </li>
        <li
          onClick={(e) => {
            e.preventDefault(); // Prevent any default behavior here
            naviagte('account/myads');
            setProfileOptions(false);
          }}
          className="flex gap-2 items-center cursor-pointer w-full px-5 py-2"
        >
          <FcAdvertising className="text-3xl" />
          <p className="text-gray-700">My ads</p>
        </li>
        <li
          onClick={(e) => {
            e.preventDefault(); // Prevent any default behavior here
            naviagte('account/orders');
            setProfileOptions(false);
          }}
          className="flex gap-2 items-center cursor-pointer w-full px-5 py-2"
        >
          <PiPackageFill className="text-amber-800 text-3xl" />
          <p className="text-gray-700">Orders</p>
        </li>
        <li
          onClick={(e) => {
            e.preventDefault(); // Prevent any default behavior here
            naviagte('account/helpnSupport');
            setProfileOptions(false);
          }}
          className="flex gap-2 items-center cursor-pointer w-full px-5 py-2"
        >
          <MdOutlineSupport className="text-3xl text-yellow-500" />
          <p className="text-gray-700">Help & Support</p>
        </li>
        <li className="flex gap-2 items-center cursor-pointer w-full px-5 py-2">
          <LuLanguages className="text-green-600 text-3xl" />
          <p className="text-gray-700">Select Language</p>
        </li>
        <li
          onClick={(e) => {
            e.preventDefault(); // Prevent any default behavior here
            setLogoutMenu(true);
          }}
          className="flex gap-2 items-center cursor-pointer w-full px-5 py-2"
        >
          <CgLogOut className="text-red-600 text-3xl" />
          <p className="text-gray-700">Logout</p>
        </li>
        <li className="flex gap-2 items-center cursor-pointer w-full px-5 py-2">
          <FcAbout className="text-3xl" />
          <p className="text-gray-700">About</p>
        </li>
      </ul>
    </div>
  );

  const isInCart = location.pathname === '/cart'; // Check if user is on the cart page

  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);

  // Debounced search function to query the backend
  const fetchProducts = debounce(async (query) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/items/search?name=${query}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  }, 500); // 500 ms delay after the user stops typing

  // This effect runs whenever the search query changes
  useEffect(() => {
    if (searchQuery) {
      fetchProducts(searchQuery);
    } else {
      setProducts([]); // Clear products when search query is empty
    }
  }, [searchQuery]); // Trigger on searchQuery change

  const navigate = useNavigate();
  return (
    <>
      <header
        style={{
          backdropFilter: 'blur(14px)',
          background: '#fcfcfb',
          fontFamily: "'Mona-Sans', sans-serif"
        }}
        className="border border-b-zinc-100 sticky top-0 w-full h-16 flex z-50 items-center justify-between lg:px-20 px-5 shadow-sm"
      >
        {logoutMenu && <LogoutBanner logoutMenuHandler={logoutMenuHandler} />}
        <div className="flex items-center">
          <NavLink
            to=""
            className="select-none text-gray-950 font-bold text-2xl cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            <p className="flex items-center">
              <p className="text-red-500">C</p>ampus
              <p className="text-red-500">Connect.</p> <sup>®</sup>
            </p>
          </NavLink>
        </div>
        <nav className="hidden md:flex items-center space-x-1">
          {navigations.map((nav, idx) => (
            <NavLink
              className={({ isActive }) =>
                `text-sm p-1 px-4 rounded-xl transition-colors duration-300 ${
                  isActive
                    ? 'bg-zinc-200 font-bold text-gray-900'
                    : 'font-medium text-gray-700 hover:bg-zinc-200'
                }`
              }
              key={idx}
              to={nav.href}
            >
              {nav.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="flex relative">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center bg-zinc-100 rounded-3xl p-1"
            >
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="lg:block hidden focus:w-80 focus:h-10 focus:px-5 focus:text-md transition-all duration-300 ease-in-out text-gray-900 text-sm w-28 outline-none bg-transparent placeholder-stone-900 px-2"
                type="text"
                placeholder="Search"
              />
              <IoIosSearch className="text-black lg:text-lg text-xl" />
            </form>

            <div className=" ">
              {products.length > 0 ? (
                <ul
                  ref={searchResultRef}
                  className="overflow-y-scroll w-full h-96 border absolute mt-12 right-0 bg-slate-50 overflow-hidden rounded-xl"
                >
                  {products.map((product) => (
                    <li
                      key={product._id}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/product/${product._id}`);
                        setProducts([]);
                      }}
                      className="mx-1 px-3 my-2 py-4 flex cursor-pointer justify-between gap-4 animate-fade-in-slide rounded-xl bg-gray-100 hover:bg-gray-200 transition-all"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className=" w-14 h-14 object-cover rounded-full"
                      />
                      <div>
                        <h3 className=" text-sm">{product.title}</h3>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                        <p className=" text-xs text-red-700">
                          Price: ${product.price}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                ''
              )}
            </div>
          </div>

          <div className="relative">
            {cartItems.length > 0 && (
              <div className="absolute right-0 z-10 text-white text-xs text-center bg-red-500 rounded-full w-3 h-3">
                <p>{cartItems.length}</p>
              </div>
            )}
            <CiShoppingCart
              onClick={() => naviagte('cart')}
              className={`text-4xl cursor-pointer p-1 shadow-xl border-2 rounded-full active:scale-95 transition-all duration-300 ease-linear ${
                isInCart ? 'bg-black text-white' : 'hover:bg-slate-200'
              }`}
            />
          </div>

          <div className="relative">
            {notifications.length > 0 && (
              <div className="absolute right-0 z-10 text-white text-xs text-center bg-red-500 rounded-full w-3 h-3">
                <p>{notifications.length}</p>
              </div>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                setNotificationPanal(!notificationPanal);
              }}
              className={`rounded-full text-2xl font-thin p-1 cursor-pointer hover:bg-sky-50 border active:scale-95 transition-all duration-300 ease-in-out shadow-xl ${
                notificationPanal ? 'bg-sky-100 scale-110' : 'bg-white'
              }`}
            >
              <IoMdNotifications />
            </button>
          </div>

          {notificationPanal && <Notifications ref={notificationRef} />}

          {user ? (
            <div ref={profileRef}>
              <img
                src={user?.profileImg}
                alt="profile"
                className="w-10 h-10 object-cover rounded-full cursor-pointer active:scale-105 transition-all ease-linear duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  setProfileOptions(!profileOptions);
                }}
              />

              {profileOptions && <ProfileOptoins />}
            </div>
          ) : (
            <a
              href="/auth"
              className="bg-black rounded-3xl px-4 py-2 text-gray-100 text-xs transition-colors duration-300 hover:bg-gray-800"
            >
              Sign In
            </a>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
