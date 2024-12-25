const LoadingCard = (props) => {
  return (
    <div
      style={{
        backdropFilter: 'blur(10px)',
        background: 'rgba(255,255,255,1)'
      }}
      className="border h-96 max-w-60 min-w-60 p-1 pb-3 flex flex-col rounded-xl shadow-sm overflow-hidden relative"
    >
      <div
        className={`${
          props?.props?.title ? '' : 'anim'
        } fixed z-40 h-full  w-4`}
      ></div>

      <div className="w-full h-full">
        <div
          style={{ borderRadius: '0.5rem' }}
          className={`w-full bg-gray-300/80 overflow-hidden border h-56 flex items-center justify-center `}
        >
          <img
            src=""
            alt={props?.props?.title ? props?.props?.title : 'Loading..'}
            className=""
          />
        </div>

        <div className="px-1">
          <h className=" my-1 bg-gray-300 rounded-md line-clamp-2 h-6"></h>
          <p className=" bg-gray-300 rounded-md line-clamp-2 h-4"></p>

          <div className="text-gray-300 text-xs">
            {'★'.repeat(3)} <span className="text-gray-500 text-xs"></span>
          </div>

          <p className="bg-gray-300 rounded-md line-clamp-2 h-8"></p>
        </div>
      </div>
      <div className="flex items-center justify-between px-2 mb-1">
        <span className="bg-gray-300 w-10 rounded-md h-6"></span>

        <button
          onClick={() => {}}
          className=" bg-gray-300 w-20 rounded-md line-clamp-2 h-6"
        ></button>
      </div>
    </div>
  );
};

export default LoadingCard;
