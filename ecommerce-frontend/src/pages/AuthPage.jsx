import { useEffect, useState } from 'react';
import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa';
import { Outlet, useNavigate } from 'react-router-dom';
import { RxCross2 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, logIn, register } from '../redux/actions/AuthAction';

const AuthPage = () => {
  const initialState = {
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  const [data, setData] = useState(initialState);

  const [passType, setPassType] = useState('password');
  const [authType, setAuthType] = useState('login');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (authType == 'login') {
      dispatch(logIn(data, navigate));
    } else {
      dispatch(register(data, navigate));
    }
  };
  const loading = useSelector((state) => state.authReducer.loading);
  let error = useSelector((state) => state.authReducer.error?.message);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError()); // Dispatch the action to set error to null
      }, 3000);

      // Clean up the timeout if the component unmounts or error changes
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return (
    <>
      {error && (
        <div className=" toast z-10 fixed h-12 top w-full flex items-center justify-center transition-all ease-in-out duration-500">
          <p className="pr-1 flex justify-center items-center h-full text-red-500">
            {error}
          </p>
          <RxCross2
            className="text-red-500 cursor-pointer"
            onClick={() => {}}
          />
        </div>
      )}
      <div
        style={{ backdropFilter: 'blur(5px)' }}
        className="bg-white mx-10 rounded py-5 mt-10 flex justify-center transition-all ease-in-out duration-200"
      >
        <form className="flex flex-col  justify-center min-w-[400px] p-6 rounded-sm">
          <h1 className="text2xl font-bold mb-6">
            {authType === 'login' ? 'Sign in' : 'Sign up'} to CampusConnect.
          </h1>

          {authType === 'login' ? (
            <>
              <div className="mb-6 w-full">
                <label
                  className="pb-1 font-semibold text-sm text-black"
                  htmlFor="email"
                >
                  Username or Email
                </label>
                <input
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  value={data.email}
                  type="email"
                  className="inputAnim form-control border rounded-2xl h-14 font-light bg-transparent outline-none pl-4 w-full"
                  id="email"
                  placeholder=""
                  required
                />
              </div>
              <div className="mb-6 w-full">
                <div className="flex justify-between">
                  <label
                    className="font-semibold text-sm text-black"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <p className="text-sm font-light underline cursor-pointer">
                    Forgot?
                  </p>
                </div>
                <div className="flex border inputAnim rounded-2xl items-center pr-3">
                  <input
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                    value={data.password}
                    type={passType}
                    className="form-control h-14 font-light bg-transparent outline-none pl-4 w-full"
                    id="password"
                    placeholder=""
                    required
                  />
                  {passType === 'password' ? (
                    <FaRegEyeSlash
                      className="cursor-pointer"
                      onClick={() => setPassType('text')}
                    />
                  ) : (
                    <FaRegEye
                      className="cursor-pointer"
                      onClick={() => setPassType('password')}
                    />
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="bg-black h-14 w-full mt-6 text-white rounded-full font-medium text-sm"
              >
                {loading ? 'Loading...' : 'Sign In'}
              </button>
              <p className="mt-4 text-sm">
                Don’t have an account?
                <span
                  className="pl-1 text-sky-600 cursor-pointer"
                  onClick={() => {
                    setAuthType('register');
                    setData(initialState);
                  }}
                >
                  Create an account
                </span>
              </p>
              <p className="mt-4 text-sm">
                Demo User:
                <br />
                Email: user@example.com
                <br />
                Password: password12345
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-5">
                <div className="mb-3 w-full">
                  <label
                    className="pb-1 font-semibold text-sm text-black"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    value={data.name}
                    type="text"
                    className="inputAnim form-control border rounded-2xl h-14 font-light bg-transparent outline-none pl-4 w-full"
                    id="name"
                    placeholder=""
                    required
                  />
                </div>

                <div className="mb-3 w-full">
                  <label
                    className="pb-1 font-semibold text-sm text-black"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    onChange={(e) =>
                      setData({ ...data, username: e.target.value })
                    }
                    value={data.username}
                    type="text"
                    className="inputAnim form-control border rounded-2xl h-14 font-light bg-transparent outline-none pl-4 w-full"
                    id="username"
                    placeholder=""
                    required
                  />
                </div>
              </div>

              <div className="mb-3 w-full">
                <label
                  className="pb-1 font-semibold text-sm text-black"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  value={data.email}
                  type="email"
                  className="inputAnim form-control border rounded-2xl h-14 font-light bg-transparent outline-none pl-4 w-full"
                  id="email"
                  placeholder=""
                  required
                />
              </div>
              <div className="mb-6 w-full">
                <label
                  className="pb-1 font-semibold text-sm text-black"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="inputAnim flex border rounded-2xl items-center pr-3">
                  <input
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                    value={data.password}
                    type={passType}
                    className="form-control h-14 bg-transparent outline-none pl-4 w-full font-light"
                    id="password"
                    placeholder="+6 Characters"
                    required
                  />
                  {passType === 'password' ? (
                    <FaRegEyeSlash
                      className="cursor-pointer"
                      onClick={() => setPassType('text')}
                    />
                  ) : (
                    <FaRegEye
                      className="cursor-pointer"
                      onClick={() => setPassType('password')}
                    />
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="bg-black h-14 w-full mt-6 text-white rounded-full font-medium text-sm"
              >
                Create Account
              </button>
              <p className="mt-4 text-sm">
                Already have an account?
                <span
                  className="pl-1 text-sky-600 cursor-pointer"
                  onClick={() => {
                    setAuthType('login');
                    setData(initialState);
                  }}
                >
                  Login to your account
                </span>
              </p>
              <p className="mt-4 text-sm">
                Email: user@example.com
                <br />
                Password: password12345
              </p>
            </>
          )}
        </form>
      </div>
      <Outlet />
    </>
  );
};

export default AuthPage;
