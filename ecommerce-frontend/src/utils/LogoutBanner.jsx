import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/actions/AuthAction';

const LogoutBanner = ({ logoutMenuHandler }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(5px)'
      }}
      className=" flex justify-center items-center h-screen fixed  z-50 top-0 bottom-0 left-0 right-0 "
    >
      <div
        style={{ background: '#fcfcfb' }}
        className=" flex flex-col justify-center items-center gap-5 border border-red-200  rounded-2xl shadow-2xl shadow-red-200 px-14 py-5 "
      >
        <h1 className=" text-lg font-semibold ">Logout</h1>
        <div className="rounded-sm flex gap-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              logoutMenuHandler();
              dispatch(logout());
              navigate('/');
            }}
            className=" border rounded-full px-5 py-1 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              logoutMenuHandler();
            }}
            className=" border rounded-full px-5 py-1  bg-green-500 hover:bg-green-600 active:bg-green-700 text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutBanner;
