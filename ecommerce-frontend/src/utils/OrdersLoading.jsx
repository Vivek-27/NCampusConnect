const OrdersLoading = () => {
  return (
    <div className=" my-1 relative w-max  overflow-hidden rounded-xl flex items-center justify-start mx-0 px-5 gap-5">
      <img
        className="w-12 h-12 rounded-full bg-gray-100 px-2"
        src=""
        alt="Item"
      />{' '}
      <div className=" anim sticky z-40 h-14 w-4"></div>
      <p className=" text-wrap bg-gray-100 rounded-md line-clamp-1 h-7 w-32"></p>
      <p className=" text-wrap line-clamp-1 h-8 w-72 bg-gray-100 rounded-md"></p>
      <p className=" bg-gray-100 rounded-md w-16 h-7"></p>
      <button className=" bg-green-100 w-24 h-8 rounded-full "></button>
    </div>
  );
};

export default OrdersLoading;
