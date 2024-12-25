import { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import Card from '../components/card/Card';
import { Outlet, useNavigate } from 'react-router-dom';
import OrdersLoading from '../utils/OrdersLoading';

const OrdersPage = () => {
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then((res) => res.json())
      .then((result) => {
        setProducts(result.products);
      });
  }, []);

  const Order = (props) => {
    return (
      <li className="flex items-center justify-start mx-0 px-5 gap-5">
        <img className="w-12 h-12" src={props.props.thumbnail} alt="" />{' '}
        <p className=" text-wrap line-clamp-1 w-32">{props.props.title}</p>
        <p className=" text-wrap line-clamp-1 w-72">
          {props.props.description}
        </p>
        <p className="">{props.props.price}</p>
        <button className=" bg-green-600 w-24 h-8 rounded-full text-white">
          Return
        </button>
      </li>
    );
  };

  return (
    <>
      <Outlet />

      <div className="border flex flex-col m-10 p-10 rounded-2xl bg-white gap-5">
        <h1 className=" text-xl font-semibold ">Your Orders</h1>
        <div className=" border rounded-sm px-5">
          <div className="flex items-center justify-between my-5 w-full ">
            <h1 className=" text-lg">Order</h1>
            <button
              disabled
              className="border px-4 h-8 rounded-xl text-sm flex items-center shadow-sm text-gray-300 gap-2 transition-all duration-200 ease-linear"
            >
              Edit <CiEdit />
            </button>
          </div>
          <div className="w-full">
            <div className=" flex flex-col gap-5 px-1 py-5">
              <li className="flex items-center justify-start mx-0 font-semibold px-5 gap-5">
                <p className="w-12 "></p>
                <p className=" text-wrap line-clamp-1 w-32">Name</p>
                <p className=" text-wrap line-clamp-1 w-72">Description</p>
                <p className="">Price</p>
              </li>
              {products.length > 0 ? (
                products.map((item, idx) => {
                  return <Order props={item} key={idx} />;
                })
              ) : (
                <>
                  <OrdersLoading />
                  <OrdersLoading />
                  <OrdersLoading />
                  <OrdersLoading />
                  <OrdersLoading />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
