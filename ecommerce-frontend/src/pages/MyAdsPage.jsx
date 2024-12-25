import { CiEdit } from 'react-icons/ci';
import Card from '../components/card/Card';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetch_myItems } from '../redux/actions/myItemsAction';
import LoadingCard from '../components/card/LoadingCard';

const MyAdsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetch_myItems());
  }, [dispatch]);

  const products = useSelector((state) => state.myItemsReducer.items);

  const AddItem = () => {
    return (
      <button
        onClick={() => {
          navigate('editproduct');
          window.scrollTo(0, 0);
        }} // Navigate to add a new product
        style={{ backdropFilter: 'blur(10px)' }}
        className="border cursor-pointer  h-96 max-w-60 min-w-60 hover:bg-slate-100 active:bg-slate-200 min-h-96 relative flex flex-col justify-center items-center rounded-xl shadow-lg ease-linear transition-all duration-100 overflow-hidden"
      >
        <p className="text-9xl fixed font-extralight text-gray-400">+</p>
        <p className="text-gray-400 p-5 text-center absolute top-10">
          Click here to sell a new Product
        </p>
      </button>
    );
  };

  const handleEdit = (productId) => {
    navigate(`editproduct/${productId}`); // Navigate to edit product page
  };

  return (
    <div className="w-full">
      <Outlet />
      <div className="border flex flex-col m-10 p-10 rounded-2xl bg-white gap-5">
        <h1 className="text-xl font-semibold">My Listed Ads</h1>
        <div className="border rounded-sm px-5">
          <div className="flex items-center justify-between my-5 w-full">
            <h1 className="text-lg">Products</h1>
            <button
              disabled
              className="border px-4 h-8 rounded-xl text-sm flex items-center shadow-sm text-gray-300 gap-2 transition-all duration-200 ease-linear"
            >
              Edit <CiEdit />
            </button>
          </div>
          <div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 px-16 mb-5">
              <AddItem />

              {products.length > 0 ? (
                products.map((item) => {
                  return (
                    <div key={item.id} onClick={() => handleEdit(item.id)}>
                      <Card type="own" props={item} />
                    </div>
                  );
                })
              ) : products.length == 0 ? (
                <>
                  <LoadingCard props={{ title: 'No Product Found' }} />
                </>
              ) : (
                <>
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAdsPage;
