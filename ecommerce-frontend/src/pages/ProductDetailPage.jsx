import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CiHeart } from 'react-icons/ci';
import { addItemToCart } from '../redux/actions/cartAction';
import { useDispatch } from 'react-redux';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://ncampusconnect-1.onrender.com/api/items/one/${id}`
        ).then((res) => res.json());

        console.log(response);
        setProduct(response[0]);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full mt-64 ">
        <p className="text-2xl text-white  px-4 py-1">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl">Product not found.</p>
      </div>
    );
  }

  return (
    <div
      style={{ background: '#fcfcfb' }}
      className=" pb-20 flex flex-col border border-gray-300 pt-6 mx-10 my-5 rounded-xl"
    >
      <div className="w-fit mt-4 lg:flex justify-center px-10 gap-10">
        <div className=" lg:w-2/5 flex flex-col gap-3">
          <div className=" overflow-hidden border w-full h-80 flex items-center justify-center">
            <img
              src={product?.image}
              alt={product?.title}
              className="object-cover hover:scale-105 transition-all cursor-pointer duration-300"
            />
          </div>
          <div className=" lg:w-1/6 border w-1/4 p-1 ">
            <img src={product?.image} className="w-20 rounded" alt="" />
          </div>
          <div className="border w-full border-gray-100"></div>
          <div className="flex items-center gap-4">
            <img
              src={product?.seller?.profileImg}
              alt=""
              className=" w-10 rounded-full"
            />
            <p className=" text-sm text-gray-500">
              {product?.seller?.username}
            </p>
          </div>
        </div>
        <div className=" lg:w-2/5">
          <h2 className="text-2xl font-bold mt-4 text-gray-800">
            {product?.title}
          </h2>
          <p className="text-gray-700 mt-2 pr-10">{product?.description}</p>
          <div className="mt-4 flex justify-between w-5/6 items-center">
            <span className="text-xl font-semibold text-red-600">
              ${product?.price?.toFixed(2)}
            </span>
            <span className="text-sm text-red-500">
              {product?.availabilityStatus}
            </span>
          </div>

          <p className="mt-2 text-gray-600">
            Brand: <span className="font-medium">{product?.brand}</span>
          </p>
          <p className="mt-2 text-gray-600">
            Dimensions:{' '}
            <span className="font-medium">{`Width: ${product?.dimensions?.width} cm, Height: ${product?.dimensions?.height} cm, Depth: ${product?.dimensions?.depth} cm`}</span>
          </p>
          <p className="mt-2 text-gray-600">
            Weight: <span className="font-medium">{product?.weight} g</span>
          </p>
          <p className="mt-2 text-gray-600">
            Return Policy:{' '}
            <span className="font-medium">{product?.returnPolicy}</span>
          </p>
          <p className="mt-2 text-gray-600">
            Warranty:{' '}
            <span className="font-medium">{product?.warrantyInformation}</span>
          </p>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Customer Reviews:</h3>
            <ul>
              {product.reviews && product?.reviews?.length > 0 ? (
                product.reviews.map((review, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {review?.comment} -{' '}
                    <span className="font-medium">{review?.rating}⭐</span>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-600">No reviews yet.</p>
              )}
            </ul>
          </div>

          <div className="flex  items-center gap-10 h-12 mt-5">
            <button
              onClick={() => dispatch(addItemToCart(product))}
              className=" active:scale-95 mt-4 h-12 w-56 bg-black text-white rounded-full px-4 py-2"
            >
              Add to Bag
            </button>
            <button className="mt-4 h-12 w-56 border-gray-400 font-light border-2 rounded-full px-4 py-2 flex items-center justify-center">
              Favourate <CiHeart className="text-3xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
