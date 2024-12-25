import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../components/card/Card';
import { Outlet } from 'react-router-dom';
import FilterCart from '../utils/FilterCart';
import LoadingCard from '../components/card/LoadingCard';
import SocialHome from '../components/Social/SocialHome';
import { fetchItems } from '../redux/actions/ItemAction';

const HomePage = () => {
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 1000,
    search: '',
    condition: ''
  });

  // Use Redux to access the items and loading state
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.itemReducer); // Assuming you have a 'items' reducer

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
    'Furniture', // Essential furniture items for a hostel room or shared living space
    'Kitchen Accessories', // Items for cooking and maintaining a shared kitchen
    'Groceries', // Basic food items for meal preparation
    'Smartphones', // Communication, studies, and entertainment
    'Mobile Accessories', // Chargers, power banks, headphones, phone cases
    'Laptops/Tablets', // For studies, assignments, and staying connected
    'Clothing', // Casual, comfortable clothing for daily use
    'Mens Shirts', // For male students looking for shirts
    'Mens Shoes', // Comfortable footwear for daily use
    'Mens Watches', // Timepieces for personal use
    'Womens Bags', // Essential bags for carrying books, essentials
    'Womens Dresses', // Comfortable and stylish clothing for female students
    'Womens Shoes', // Footwear for female students
    'Womens Watches', // Timepieces for female students
    'Skin Care', // Personal care products like skincare items
    'Sports Accessories', // Items for fitness, gym, or recreational activities
    'Mobile Accessories', // Phone cases, chargers, power banks, etc.
    'Tablets', // For study, entertainment, or browsing
    'Sunglasses', // Protection from the sun and fashion
    'Vehicle', // Bikes, scooters, etc. for commuting
    'Home Decoration' // To personalize living space (e.g., room décor)
  ];

  // Update filters state when a new filter is applied
  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  return (
    <div className="w-full flex flex-col items-center transition-all duration-300 ease-in-out">
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
      <Footer />
    </div>
  );
};

export default HomePage;
