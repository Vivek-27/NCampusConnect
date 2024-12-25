import LoadingCard from '../card/LoadingCard';
import { useEffect, useState } from 'react';
import Card from '../card/Card';
import {  useParams } from 'react-router-dom';
import { getUser } from '../../redux/api/UserRequest';
import { fetchUserItems } from '../../redux/api/ItemRequest';
import ChatWrapper from './ChatWrapper';

const UserDetails = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState();
  const [messagePop, setMessagePop] = useState(false)
  const { id } = useParams();

  useEffect(() => {
    getUser(id).then((data) => setUser(data?.data));
    fetchUserItems(id).then((data) => setProducts(data?.data));
  }, [id]);
  return (
    <>
    <div className=" rounded-xl bg-white flex flex-col py-5 px-32 m-10 relative">
    {messagePop && <ChatWrapper  props={id}/>}

      <h1 className=" text-center font-bold text-2xl my-1 text-gray-700 ">
        Find your college
      </h1>

      <div className="flex items-center justify-between">
        <div className="flex gap-4 my-1 px-1 py-3">
          <img
            src={user?.profileImg}
            alt="profileImage"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div className=" py-2">
            <p className="text-lg text-gray-800">
              {user?.firstname} {user?.lastname}
            </p>
            <p className="text-sm text-gray-700">{user?.username}</p>
            <p className="text-xs text-gray-600  w-96">{user?.about}</p>
            <p>{user?.bio}</p>
          </div>
        </div>
        <div className="flex gap-10">
          <button
            onClick={() =>setMessagePop(!messagePop)}
            className=" rounded-xl text-red-600 text-sm px-3 py-2 bg-red-50 "
          >
            Message
          </button>
          <button className=" rounded-xl text-sky-600 text-sm  px-3 py-2 bg-sky-50 ">
            Follow
          </button>
        </div>
      </div>
      <div className=" mb-10  flex items-center justify-center gap-20 px-5 py-2">
        <p>{user?.followers.length > 0 ? user?.followers.length : 0} Followers</p>
        <p> {user?.following.length > 0 ? user?.following.length : 0} Following</p>
      </div>
      <div className=" w-fit grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 pb-10">
        {products.length > 0 ? (
          products.map((item, idx) => {
            return <Card props={item} key={idx} />;
          })
        ) : products.length == 0 ? (
          <>
            <LoadingCard props={{ title: 'No Products Found' }} />
            <LoadingCard props={{ title: 'No Products Found' }} />
            <LoadingCard props={{ title: 'No Products Found' }} />
          </>
        ) : (
          <>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default UserDetails;
