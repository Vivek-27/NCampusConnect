import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { all_users } from '../../redux/api/UserRequest';
import {
  acceptFollowRequest,
  followUser,
  withdrawFollowUser
} from '../../redux/actions/UserAction';
import { debounce } from 'lodash';
import { SlRefresh } from 'react-icons/sl';
import { CiSearch } from 'react-icons/ci';
import axios from 'axios';
import { fetchUserItems } from '../../redux/api/ItemRequest';
const SocialHome = () => {
  const user = useSelector((state) => state?.authReducer?.authData?.user);
  const friends = user?.followings;
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  // Debounced search function to query the backend
  const fetchSearchUsers = debounce(async (query) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/getSearchUsers?name=${query}`
      );
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  }, 500); // 500 ms delay after the user stops typing

  const getAllUsers = async () => {
    await all_users().then((data) => {
      setUsers(data.data);
    });
  };
  useEffect(() => {
    if (searchQuery) {
      fetchSearchUsers(searchQuery);
    } else {
      getAllUsers();
    }
  }, [searchQuery]);

  const Users = (props) => {
    const navigate = useNavigate();

    // Extract user id and relevant information
    const userId = props?.props?._id;
    const profileImg = props?.props?.profileImg;
    const username = props?.props?.username;

    // Handle Follow Request
    const handleFollow = () => {
      dispatch(followUser(userId));
    };

    // Handle Follow Withdrawal (Cancel sent follow request)
    const handleFollowWithdrawl = () => {
      dispatch(withdrawFollowUser(userId));
    };

    // Handle Accepting Follow Request
    const handleAcceptFollow = () => {
      dispatch(acceptFollowRequest(userId));
    };

    // Handle Profile Click
    const handleProfileClick = () => {
      navigate(`/user/${userId}`);
    };

    // Determine the button text and action
    let buttonText = 'Follow';
    let buttonAction = handleFollow;
    let buttonStyle = 'bg-sky-500';
    let buttonStyleActive = 'bg-sky-600';

    if (user?.following?.includes(userId)) {
      buttonText = 'Unfollow';
      buttonAction = handleFollowWithdrawl;
      buttonStyle = 'bg-red-500';
      buttonStyleActive = 'bg-red-600';
    } else if (user?.followRequests?.includes(userId)) {
      buttonText = 'Accept';
      buttonAction = handleAcceptFollow;
      buttonStyle = 'bg-green-500';
      buttonStyleActive = 'bg-green-600';
    } else if (user?.follows?.includes(userId)) {
      buttonText = 'Follow Back';
      buttonAction = handleAcceptFollow;
      buttonStyle = 'bg-green-500';
      buttonStyleActive = 'bg-green-600';
    } else if (user?.sentFriendRequests?.includes(userId)) {
      buttonText = 'Request Sent';
      buttonAction = handleFollowWithdrawl;
      buttonStyle = 'bg-sky-500';
      buttonStyleActive = 'bg-sky-600';
    }

    return (
      <div className="w-full bg-white cursor-pointer rounded-xl py-2 px-2 flex items-center justify-between gap-3 ">
        {props?.props && (
          <>
            {/* User Info */}
            <div onClick={handleProfileClick} className="flex gap-2">
              <img
                src={profileImg}
                alt="User Profile"
                className="w-10 h-10 rounded-full border object-cover"
              />
              <p className="text-gray-600 text-xs py-2">{username}</p>
            </div>

            {/* Action Button */}
            <div className="flex gap-3 px-2">
              <button
                onClick={buttonAction}
                className={`rounded-lg text-gray-50 text-xs px-4 py-2 ${buttonStyle} active:${buttonStyleActive} active:scale-95`}
              >
                {buttonText}
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      style={{ background: '#fcfcfb' }}
      className="w-80 h-full flex flex-col rounded-3xl shadow-xl py-3 px-2 lg:sticky top-32 mb-10"
    >
      <h1 className=" text-center font-bold text-lg my-1 text-gray-900 ">
        {user ? 'Find your college' : 'Please Login'}
      </h1>

      <div className="flex gap-4 my-1 px-2 py-1">
        <img
          src={
            user
              ? user?.profileImg
              : 'https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png'
          }
          alt=""
          className="w-16 h-16 bg-white rounded-full object-cover border"
        />
        <div className="py-1">
          <p className="text-md bg-gray-50 text-gray-700 w-48 rounded-lg">
            {user?.firstname} {user?.lastname}
          </p>
          <p className="text-xs text-gray-600 bg-gray-50 w-40 rounded-lg h-5">
            {user?.username}
          </p>
          <p>{user?.bio}</p>
        </div>
      </div>
      <div className="  flex items-center justify-center gap-10 text-sm text-gray-500 py-2">
        <p>{user?.followers > 0 ? user?.followers : 0} Follows</p>
        <p> {user?.following > 0 ? user?.following : 0} Following</p>
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex justify-between bg-gray-100 rounded-xl items-center my-1"
      >
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          className=" outline-none text-md px-5 py-2 bg-transparent text-gray-700 "
          placeholder="Search"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            if (users.length > 0) {
              fetchSearchUsers();
            } else {
              getAllUsers();
            }
          }}
          className="rounded-full w-8 h-8"
        >
          {users.length > 0 ? <CiSearch /> : <SlRefresh />}
        </button>
      </form>

      <div className="bg-gray-100 w-full h-full rounded-md overflow-hidden overflow-y-scroll px-2 py-2 flex flex-col gap-2">
        {users.length > 0
          ? users.map((item, idx) => {
              return <Users props={item} key={idx} />;
            })
          : 'Users not found'}
      </div>
    </div>
  );
};

export default SocialHome;
