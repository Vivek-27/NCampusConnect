//icons
import { MdManageAccounts } from 'react-icons/md';
import { PiPackageFill } from 'react-icons/pi';
import { MdOutlineSupport } from 'react-icons/md';
import { LuLanguages } from 'react-icons/lu';
import { CgLogOut } from 'react-icons/cg';
import { FcAbout } from 'react-icons/fc';
import { FcAdvertising } from 'react-icons/fc';
import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LogoutBanner from '../utils/LogoutBanner';
import { useSelector } from 'react-redux';

const AccountDetails = () => {
  const navigate = useNavigate();
  const [logoutMenu, setLogoutMenu] = useState(false);
  const someError = useSelector((state) => state.myItemsReducer.error);

  const logoutMenuHandler = () => {
    setLogoutMenu((state) => !state);
  };
  const ProfileOptoins = () => {
    return (
      <>
        {/* Error Notification */}
        {someError && (
          <div className="fixed top-0 left-0 z-40 w-full bg-red-600 py-3 text-white text-center">
            {someError?.message === 'No token provided' ? (
              <p>Please logout and login again</p>
            ) : (
              <p>{someError?.message}</p>
            )}
          </div>
        )}

        {/* Profile Options Sidebar */}
        <div
          style={{ background: '#fcfcfb' }}
          className="border-r-2 w-80 pt-8 px-6 h-screen sticky top-24 transition-all duration-300 ease-in-out hover:shadow-2xl"
        >
          <ul className="flex flex-col gap-6 text-center h-full">
            {/* Account Option */}
            <li
              onClick={() => navigate('profile')}
              className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 hover:text-gray-700"
            >
              <MdManageAccounts className="text-3xl text-gray-600 mb-2" />
              <p className="text-sm font-medium text-gray-600">Account</p>
            </li>

            {/* My Ads Option */}
            <li
              onClick={() => navigate('myads')}
              className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 hover:text-gray-700"
            >
              <FcAdvertising className="text-3xl text-gray-600 mb-2" />
              <p className="text-sm font-medium text-gray-600">My Ads</p>
            </li>

            {/* Orders Option */}
            <li
              onClick={() => navigate('orders')}
              className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 hover:text-gray-700"
            >
              <PiPackageFill className="text-3xl text-amber-600 mb-2" />
              <p className="text-sm font-medium text-gray-600">Orders</p>
            </li>

            {/* Help & Support Option */}
            <li
              onClick={() => navigate('helpnSupport')}
              className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 hover:text-gray-700"
            >
              <MdOutlineSupport className="text-3xl text-yellow-500 mb-2" />
              <p className="text-sm font-medium text-gray-600">
                Help & Support
              </p>
            </li>

            {/* Language Selection Option */}
            <li className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 hover:text-gray-700">
              <LuLanguages className="text-3xl text-green-600 mb-2" />
              <p className="text-sm font-medium text-gray-600">
                Select Language
              </p>
            </li>

            {/* Logout Option */}
            <li
              onClick={() => setLogoutMenu(true)}
              className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 hover:text-gray-700"
            >
              <CgLogOut className="text-3xl text-red-600 mb-2" />
              <p className="text-sm font-medium text-gray-600">Logout</p>
            </li>

            {/* About Option */}
            <li className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 hover:text-gray-700">
              <FcAbout className="text-3xl text-gray-600 mb-2" />
              <p className="text-sm font-medium text-gray-600">About</p>
            </li>
          </ul>
        </div>
      </>
    );
  };

  return (
    <div className="flex bg-slate-100/10 ">
      {logoutMenu && <LogoutBanner logoutMenuHandler={logoutMenuHandler} />}
      <div className="left lg:block sm:hidden ">
        <ProfileOptoins />
      </div>
      <div className="right-0 w-full ">
        <Outlet />
      </div>
    </div>
  );
};

export default AccountDetails;
