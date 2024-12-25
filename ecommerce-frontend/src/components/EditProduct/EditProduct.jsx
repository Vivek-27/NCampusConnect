import { useState, useEffect } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineFileDownloadDone } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { IoMdClose } from 'react-icons/io';

import {
  addItem,
  updateItem,
  deleteItem
} from '../../redux/actions/myItemsAction';
import { useParams } from 'react-router-dom';
import { clearError } from '../../redux/actions/AuthAction';
import axios from 'axios';

const EditProduct = () => {
  const initialState = {
    title: '',
    description: '',
    brand: '',
    category: '',
    condition: '',
    price: '',
    image: '',
    thumbnail: ''
  };

  const categories = [
    'Cars',
    'Bikes',
    'Motorcycles',
    'Scooters',
    'Spare Parts',
    'Bicycles',
    'Properties',
    'For Sale: Houses & Apartments'
  ];

  const [file, setFile] = useState(null);
  const [dataForm, setDataForm] = useState(initialState);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [image, setImage] = useState();

  const dispatch = useDispatch();

  const { productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          const result = axios.put(
            `https://ncampusconnect-1.onrender.com/api/item/one/${productId}`
          );
          console.log(result);
          if (result) {
            setDataForm({
              title: result.title,
              description: result.description,
              brand: result.brand,
              category: result.category,
              price: result.price
            });
            setFile(result.thumbnail); // Assuming result.thumbnail holds the image URL
          }
        } catch (error) {
          console.error('Failed to fetch product:', error);
        }
      } else {
        // Reset state if there's no productId
        setDataForm(initialState);
        setFile(null);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const value = e.target.value;
    setDataForm((prevForm) => ({
      ...prevForm,
      category: value
    }));

    if (value) {
      const filtered = categories.filter((category) =>
        category.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  };

  const handleSelect = (category) => {
    setDataForm((prevForm) => ({
      ...prevForm,
      category
    }));
    setFilteredCategories([]); // Clear suggestions after selection
  };

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    setDataForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const itemImgUpload = async (file) => {
    dispatch({ type: 'FETCH_ITEMS_START' });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'campusconnectItems');

    try {
      await axios
        .post(
          'https://api.cloudinary.com/v1_1/campusconnect1234/image/upload',
          formData
        )
        .then((data) => {
          const imageUrl = data.data.secure_url;
          setFile(imageUrl);
          setDataForm((prevForm) => {
            const updatedForm = { ...prevForm, image: imageUrl };
            return updatedForm;
          });

          dispatch({ type: 'FETCH_ITEMS_SUCCESS' });
        });
    } catch (error) {
      alert('Error uploading file:', error);
      dispatch({ type: 'FETCH_ITEMS_FAIL' });
      return;
    }
  };

  const handleSubmitupdateItem = async (e) => {
    if (!dataForm.title) {
      alert('Please enter a Title');
      return;
    }
    if (!dataForm.price) {
      alert('Please set a Price');
      return;
    }
    dispatch(updateItem(productId, dataForm));
  };
  const handleSubmitaddItem = async (e) => {
    if (!dataForm.title) {
      alert('Please enter a Title');
      return;
    }
    if (!dataForm.price) {
      alert('Please set a Price');
      return;
    }
    dispatch(addItem(dataForm));
  };

  const handleDelete = () => {
    if (
      productId &&
      window.confirm('Are you sure you want to delete this item?')
    ) {
      dispatch(deleteItem(productId));
    }
  };

  const item = useSelector((state) => state?.itemReducer);

  return (
    <div>
      {item.error && (
        <div className="bg-red-500  z-40 top-0 w-full py-5 text-white flex items-center justify-center gap-1 text-center">
          {item.error.message}{' '}
          <IoMdClose
            className=" cursor-pointer"
            onClick={() => dispatch(clearError())}
          />
        </div>
      )}
      {item.loading && (
        <svg
          aria-hidden="true"
          className="w-8 h-8 fixed left:1/2 right-1/2 top-1/2 bottom-1/2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      )}
      <div className="border z-20 flex flex-col m-10 p-10 rounded-2xl bg-white gap-5">
        <h1 className="text-xl font-semibold">
          {productId ? 'Edit Your Product' : 'Add New Product'}
        </h1>
        <div className="flex items-center justify-between my-5 w-full">
          <h1 className="text-lg">Product</h1>
          {productId && (
            <button
              onClick={handleDelete}
              className="border px-4 h-8 rounded-xl text-sm flex items-center shadow-sm text-red-600 gap-2 transition-all duration-200 ease-linear"
            >
              Delete <CiEdit />
            </button>
          )}
        </div>

        <div>
          {file && (
            <img
              src={file}
              alt="Product Preview"
              className="w-20 h-20 object-cover border rounded overflow-hidden mb-10"
            />
          )}
          <form className="grid grid-cols-2 gap-10 mb-5">
            <input
              type="text"
              placeholder="Title"
              required
              name="title"
              value={dataForm.title}
              onChange={handleValueChange}
              className="border-b-2 w-full pl-1 bg-transparent placeholder:font-thin outline-none"
            />
            <input
              id="file-upload"
              onChange={(event) => {
                itemImgUpload(event.target.files[0]);
              }}
              accept="image/*"
              type="file"
            />
            <textarea
              placeholder="Description"
              name="description"
              value={dataForm.description}
              onChange={handleValueChange}
              className="border-b-2 w-full min-h-20 pl-1 bg-transparent placeholder:font-thin outline-none"
            />
            <input
              type="text"
              name="brand"
              value={dataForm.brand}
              onChange={handleValueChange}
              placeholder="Brand"
              className="border-b-2 h-fit w-full pl-1 bg-transparent placeholder:font-thin outline-none"
            />
            <div>
              <input
                type="text"
                value={dataForm.category}
                onChange={handleChange}
                placeholder="Select a category..."
                className="border p-2 w-full outline-none"
              />
              {filteredCategories.length > 0 && (
                <ul className="border border-t-0">
                  {filteredCategories.map((category, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelect(category)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <input
              type="number"
              name="price"
              value={dataForm.price}
              onChange={handleValueChange}
              max={500000}
              min={50}
              required
              placeholder="Price"
              className="border-b-2 w-full pl-1 bg-transparent placeholder:font-thin outline-none"
            />
            <div>
              <h1>Select an Option</h1>
              <select
                value={selectedOption}
                onChange={(event) => {
                  setSelectedOption(event.target.value);
                }}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="good">Good</option>
                <option value="bad">Bad</option>
                <option value="excellent">Excellent</option>
              </select>

              {selectedOption && (
                <div>
                  <h2>You selected: {selectedOption}</h2>
                </div>
              )}
            </div>
          </form>
          {productId ? (
            <button
              onClick={() => handleSubmitupdateItem()}
              className="border flex items-center justify-center gap-2 mt-8 px-5 py-2 rounded-2xl shadow-md hover:bg-green-700 active:scale-95 bg-green-600 text-white transition-all duration-100 ease-linear"
            >
              Update <MdOutlineFileDownloadDone />
            </button>
          ) : (
            <button
              onClick={() => handleSubmitaddItem()}
              className="border flex items-center justify-center gap-2 mt-8 px-5 py-2 rounded-2xl shadow-md hover:bg-green-700 active:scale-95 bg-green-600 text-white transition-all duration-100 ease-linear"
            >
              Publish <MdOutlineFileDownloadDone />
            </button>
          )}
        </div>
      </div>{' '}
    </div>
  );
};

export default EditProduct;
