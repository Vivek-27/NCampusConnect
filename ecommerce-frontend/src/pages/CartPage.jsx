import { IoIosArrowRoundBack } from 'react-icons/io';
import { FaCartShopping } from 'react-icons/fa6';
import { SiRazorpay } from 'react-icons/si';
import { useDispatch, useSelector } from 'react-redux';
import { removeItemFromCart } from '../redux/actions/cartAction';
import ClipLoader from 'react-spinners/ClipLoader';
import { useEffect, useState } from 'react';
import axios from 'axios';

const CartPage = () => {
  const [total, setTotal] = useState(0);
  const cartItems = useSelector((state) => state.cartReducer.items);
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.cartReducer.loading);
  const color = '#000000';

  useEffect(() => {
    let totalPrice = 0;
    cartItems.length > 0 &&
      cartItems.map((item) => (totalPrice = totalPrice + item.price));
    setTotal(totalPrice);
  }, [cartItems]);

  const Items = (props) => {
    return (
      <li className="flex gap-6 items-center py-6 px-4 border border-gray-200 hover:shadow-lg transition-all rounded-lg bg-white shadow-sm hover:bg-gray-50">
        <img
          className="w-24 h-24 object-cover rounded-lg shadow-sm"
          src={props?.props?.image}
          alt=""
        />
        <div className="flex flex-col">
          <p className="text-lg font-medium text-gray-900">
            {props?.props?.title}
          </p>
          <p className="text-gray-600 text-sm">${props?.props?.price}</p>
        </div>
        <button
          onClick={() => {
            dispatch(removeItemFromCart(props?.props?._id));
          }}
          className="ml-auto text-red-500 text-sm font-medium hover:text-red-700 transition-all"
        >
          Remove
        </button>
      </li>
    );
  };

  const initPay = (data) => {
    const options = {
      key: 'rzp_test_AugzZsQsXxRMWt',
      amount: data.amount,
      currency: data.currency,
      name: 'shoe.name',
      description: 'Test',
      image: 'shoe.img',
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyURL =
            'https://ncampusconnect-1.onrender.com/api/payment/verify';
          const { data } = await axios.post(verifyURL, response);
          if (data) {
            dispatch({ type: 'CART_CLEAR' });
          }
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: '#3399cc'
      }
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handlePay = async () => {
    try {
      const orderURL =
        'https://ncampusconnect-1.onrender.com/api/payment/orders';
      const { data } = await axios.post(orderURL, {
        amount: total.toFixed(2)
      });
      initPay(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100 p-5 sm:px-36">
      {/* Loading Spinner */}
      <div className="w-full flex fixed items-center justify-center z-10">
        <ClipLoader color={color} loading={loading} size={50} />
      </div>

      {/* Header Section */}
      <div className="flex items-center justify-between px-10 mb-5">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          My Cart <FaCartShopping />
        </h1>
        <button className="hidden lg:flex items-center justify-center gap-1 text-gray-700 border px-4 py-2 rounded-full hover:bg-gray-100 transition-all">
          <IoIosArrowRoundBack className="text-xl" /> Continue Shopping
        </button>
      </div>

      <div className="lg:flex justify-between gap-16 px-10">
        {/* Left Section: Cart Items */}
        <div className="w-full bg-white rounded-lg shadow-xl p-8 transition-all">
          <div className="flex w-full items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Shopping Cart
            </h2>
            <button
              onClick={() => dispatch({ type: 'CART_CLEAR' })}
              className="text-sm text-red-500"
            >
              Clear cart
            </button>
          </div>
          <ul className="flex flex-col gap-6">
            {cartItems.length > 0 ? (
              cartItems.map((item, idx) => <Items key={idx} props={item} />)
            ) : (
              <div className="flex flex-col items-center justify-center mt-12">
                <img
                  className="w-80"
                  src="https://cdn-icons-png.flaticon.com/512/2762/2762885.png"
                  alt="Empty Cart"
                />
                <p className="font-semibold text-gray-600 mt-4">
                  Your Cart is Empty
                </p>
              </div>
            )}
          </ul>
        </div>

        {/* Right Section: Payment Information */}
        <div className="bg-white rounded-lg shadow-xl h-96 mt-10 lg:mt-0 p-8 w-96">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Payment Info
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm font-medium text-gray-600 pb-2">
              Payment Method
            </p>
            <ul className="flex flex-col gap-6">
              <label
                htmlFor="credit_card"
                className="flex gap-2 items-center cursor-pointer"
              >
                <input type="radio" name="paymentMethod" id="credit_card" />
                <SiRazorpay />
                Razorpay
              </label>
            </ul>
          </div>

          <div className="flex flex-col gap-6 mb-6">
            <div className="flex items-center justify-between text-lg text-gray-700">
              <p>Total Amount:</p>
              <p className="font-semibold">${total.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between text-lg text-gray-700">
              <p>Shipping:</p>
              <p className="text-green-600 font-semibold">Free</p>
            </div>
          </div>

          <button
            onClick={handlePay}
            className="w-full h-12 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
