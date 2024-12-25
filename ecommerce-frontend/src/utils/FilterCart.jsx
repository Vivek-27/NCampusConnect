import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchItems } from '../redux/actions/ItemAction';

const FilterCart = ({ categories }) => {
  const dispatch = useDispatch();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (e) => {
    const value = e.target.value.split(',').map(Number);
    setPriceRange(value);
  };

  // Effect to apply filters automatically when selected categories or price range changes
  useEffect(() => {
    dispatch(fetchItems({ categories: selectedCategories, priceRange }));
  }, [selectedCategories, priceRange, dispatch]);

  return (
    <div
      style={{ background: '#fcfcfb' }}
      className="border border-gray-300 rounded-lg min-w-56 h-fit min-h-96 px-3 py-5"
    >
      <h2 className="text-md font-semibold text-gray-900">Filter</h2>

      <div className="max-w-full flex flex-col gap-1 border-gray-200 px-1 text-sm text-gray-500 py-1">
        <h3>Categories</h3>
        {categories?.map((category) => (
          <label key={category} className="flex gap-1">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
            {category}
          </label>
        ))}
      </div>

      {/* <div className="border-b-2 border-gray-200 px-1 text-sm text-gray-500 py-1">
        <h3>Price Range</h3>
        <input
          type="range"
          min="0"
          max="1000"
          value={priceRange.join(',')}
          onChange={handlePriceChange}
        />
        <p>
          ${priceRange[0]} - ${priceRange[1]}
        </p>
      </div> */}
    </div>
  );
};

export default FilterCart;
