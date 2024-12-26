import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../components/card/Card';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import FilterCart from '../utils/FilterCart';
import LoadingCard from '../components/card/LoadingCard';
import SocialHome from '../components/Social/SocialHome';
import { fetchItems } from '../redux/actions/ItemAction';
import { PiChatCircleTextFill } from 'react-icons/pi';
import ChatMenu from '../components/Chat/ChatMenu';
import useClickOutside from '../hooks/useClickOutside';

const HomePage = () => {
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 1000,
    search: '',
    condition: ''
  });

  const [chatMenu, setChatMenu] = useState(false);

  // Use Redux to access the items and loading state
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.itemReducer); // Assuming you have a 'items' reducer

  const navigate = useNavigate();

  // Fetch products based on filters (dispatches fetchItems)
  const fetchProducts = () => {
    const queryParams = new URLSearchParams(filters).toString();
    dispatch(fetchItems(queryParams)); // Pass filters as query params
  };

  const Footer = () => {
    return (
      <footer className="w-full text-gray-700 bg-gray-100 mt-20 body-font">
        <div className="container flex flex-col flex-wrap px-5 py-24 mx-auto md:items-center lg:items-start md:flex-row md:flex-no-wrap">
          <div className="flex justify-center gap-8 md:flex-row md:flex-wrap items-center">
            <div>
              <h3 className="text-xl font-semibold">About Us</h3>
              <p className="mt-2 text-gray-600">
                We provide a wide variety of products for students. Find
                everything you need for hostel life, from clothing to
                electronics.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Quick Links</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <a href="/home" className="text-gray-600 hover:text-sky-500">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/categories"
                    className="text-gray-600 hover:text-sky-500"
                  >
                    Categories
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-600 hover:text-sky-500"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Follow Us</h3>
              <div className="flex gap-4 mt-2">
                <a
                  href="https://facebook.com"
                  className="text-gray-600 hover:text-blue-600"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://twitter.com"
                  className="text-gray-600 hover:text-blue-400"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="https://instagram.com"
                  className="text-gray-600 hover:text-pink-600"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-200 text-center py-4">
          <p className="text-gray-500 text-sm">
            © 2024 Campus Connect. All Rights Reserved.
          </p>
        </div>
      </footer>
    );
  };

  // Fetch initial data on mount and whenever filters change
  useEffect(() => {
    fetchProducts();
  }, [filters, dispatch]); // Trigger whenever filters or dispatch change
  const categories = [
    'Room Essentials',
    'Cooking & Kitchenware',
    'Food & Snacks',
    'Electronics & Gadgets',
    'Study Materials',
    'Apparel & Fashion',
    'Shoes & Footwear',
    'Bags & Backpacks',
    'Personal Care & Hygiene',
    'Fitness & Sports Gear',
    'Outdoor & Travel Gear',
    'Home Décor & Organization',
    'Entertainment & Hobbies',
    'Health & Wellness',
    'Tech Accessories',
    'Cleaning Supplies',
    'Stationery & Office Supplies',
    'Seasonal Items'
  ];

  // Update filters state when a new filter is applied
  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  // const { messages } = useOutletContext();
  const [position, setPosition] = useState({ x: 30, y: 30 }); // initial position of the div
  const [isDragging, setIsDragging] = useState(false); // to check if the div is being dragged
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // stores the difference between mouse and div position

  // When mouse is pressed on the div
  const onMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // When mouse is moved, update the position of the div
  const onMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });
    }
  };

  // When mouse is released, stop dragging
  const onMouseUp = () => {
    setIsDragging(false);
  };

  // Bind the mouse move and mouse up to the window to handle drag outside the div
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  const user = JSON.parse(localStorage?.getItem('profile'));
  const userId = user?._id;

  return (
    <div className="w-full flex flex-col items-center transition-all duration-300 ease-in-out relative">
      <Outlet />
      <h1
        style={{
          backdropFilter: 'blur(5px)',
          color: 'rgba(255,255,255,.5)'
        }}
        className="w-full bg-white/10 py-3 text-center text-7xl sm:text-9xl font-extrabold "
      >
        CAMPUS CONNECT
      </h1>
      <div className="lg:flex justify-center gap-8 py-10">
        <SocialHome className="" />
        <div className="flex justify-center gap-5">
          <FilterCart
            categories={categories}
            onFilterChange={handleFilterChange}
          />
          <div className="w-fit grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 pb-10">
            {loading ? (
              <>
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
              </>
            ) : items?.length > 0 ? (
              items.map((item, idx) => <Card props={item} key={idx} />)
            ) : (
              <>
                {' '}
                <LoadingCard props={{ title: 'No Products found' }} />
              </>
            )}
          </div>
        </div>
      </div>

      <PiChatCircleTextFill
        onClick={(e) => {
e.preventDefault();
          setChatMenu(true);
        }}
        className="fixed  text-green-600 border rounded-full p-2 bg-white right-10 bottom-10 w-16 h-14 cursor-pointer hover:scale-95 active:scale-105 transition-all animate-scroll-in-slide shadow-xl "
      />
      {chatMenu && (
        <div
          onMouseDown={onMouseDown}
          style={{
            position: 'absolute',
            left: position.x,
            top: position.y,
            cursor: 'move',
            textAlign: 'center'
          }}
          className=" h-full"
        >
          <ChatMenu setChatMenu={setChatMenu} />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default HomePage;
