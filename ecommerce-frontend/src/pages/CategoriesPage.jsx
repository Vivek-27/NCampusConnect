import { useState } from 'react';

const categoryBackgrounds = {
  Furniture:
    'url("https://www.publicdomainpictures.net/pictures/250000/velka/furniture-in-the-living-room-1571071447Fjj.jpg")',
  'Kitchen Accessories':
    'url("https://images.pexels.com/photos/1447666/pexels-photo-1447666.jpeg")',
  Groceries:
    'url("https://www.pexels.com/photo/food-photography-of-variety-of-vegetables-1785099/")',
  Smartphones: 'url("https://www.pexels.com/photo/silver-iphone-5-1036624/")',
  'Mobile Accessories':
    'url("https://www.pexels.com/photo/close-up-photo-of-phone-case-on-table-1181384/")',
  'Laptops/Tablets':
    'url("https://www.pexels.com/photo/silver-macbook-pro-on-table-near-black-pen-1181239/")',
  Clothing:
    'url("https://www.pexels.com/photo/photo-of-two-persons-wearing-blue-denim-jeans-1222270/")',
  'Mens Shirts':
    'url("https://www.pexels.com/photo/photo-of-man-wearing-gray-collared-shirt-1213191/")',
  'Mens Shoes':
    'url("https://www.pexels.com/photo/photo-of-person-wearing-gray-and-white-sneakers-1158321/")',
  'Mens Watches':
    'url("https://www.pexels.com/photo/silver-and-black-round-analog-watch-302586/")',
  'Womens Bags':
    'url("https://www.pexels.com/photo/photo-of-woman-holding-brown-handbag-1270297/")',
  'Womens Dresses':
    'url("https://www.pexels.com/photo/photo-of-woman-wearing-blue-dress-1108291/")',
  'Womens Shoes':
    'url("https://www.pexels.com/photo/photo-of-woman-wearing-black-heels-1108293/")',
  'Womens Watches':
    'url("https://www.pexels.com/photo/black-analog-watch-1170085/")',
  'Skin Care':
    'url("https://www.pexels.com/photo/photo-of-clear-bottle-and-pink-flowers-3922184/")',
  'Sports Accessories':
    'url("https://www.pexels.com/photo/close-up-photo-of-dumbbell-3190142/")',
  Tablets: 'url("https://www.pexels.com/photo/person-holding-tablet-1181244/")',
  Sunglasses: 'url("https://www.pexels.com/photo/photo-of-sunglasses-924754/")',
  Vehicle:
    'url("https://www.pexels.com/photo/silver-motorcycle-near-trees-1174136/")',
  'Home Decoration':
    'url("https://www.pexels.com/photo/photo-of-room-with-interior-design-3965507/")'
};

const CategoriesPage = () => {
  const categories = [
    'Furniture',
    'Kitchen Accessories',
    'Groceries',
    'Smartphones',
    'Mobile Accessories',
    'Laptops/Tablets',
    'Clothing',
    'Mens Shirts',
    'Mens Shoes',
    'Mens Watches',
    'Womens Bags',
    'Womens Dresses',
    'Womens Shoes',
    'Womens Watches',
    'Skin Care',
    'Sports Accessories',
    'Tablets',
    'Sunglasses',
    'Vehicle',
    'Home Decoration'
  ];

  return (
    <div
      style={{ background: '#fcfcfb' }}
      className="px-10 m-5 pb-10 pt-2 rounded-xl fixed z-10 transition-all duration-300 ease-in-out"
    >
      <h2 className="my-5 text-2xl text-center font-semibold text-gray-700">
        Categories
      </h2>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-8 px-16">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category}
              style={{
                backgroundImage: categoryBackgrounds[category],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white'
              }}
              className="flex flex-col justify-center items-center text-center px-5 py-2 rounded-xl bg-opacity-60 backdrop-blur-md shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in"
            >
              <div className="text-lg font-semibold">{category}</div>
              <div className="text-xs">Shop Now</div>
            </div>
          ))
        ) : (
          <h1>Loading Categories...</h1>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
