import { useEffect, useState } from 'react';
import { CiEdit, CiGlass } from 'react-icons/ci';
import { useDispatch, useSelector } from 'react-redux';
import { Form, useNavigate } from 'react-router-dom';
import { updateUser } from '../redux/actions/UserAction';
import { clearError } from '../redux/actions/AuthAction';
import axios from 'axios';
import './style/index.css';

const ProfilePage = () => {
  const [editProfile, setEditProfile] = useState(true);

  const initialState = {
    firstname: '',
    lastname: '',
    username: '',
    new_username: '',
    profileImg: '',
    email: '',
    phone: '',
    about: '',
    country: '',
    city: '',
    postalCode: ''
  };

  const [personalInfo, setPersonalInfo] = useState(initialState);
  const [newUsername, setNewUsername] = useState('');
  const [file, setFile] = useState();
  const [isChecked, setIsChecked] = useState(false);

  const data = useSelector((state) => state?.authReducer);
  const user = data?.authData?.user;

  const dispatch = useDispatch();

  const navig = useNavigate();
  useEffect(() => {
    if (user == null) {
      navig('/auth');
    }
    setPersonalInfo(user);
    setFile(user.profileImg);
    setNewUsername(user.username);
    setIsChecked(user.private);
  }, [user, navig]);

  useEffect(() => {
    if (data.error) {
      const timer = setTimeout(() => {
        dispatch(clearError()); // Dispatch the action to set error to null
      }, 3000);

      // Clean up the timeout if the component unmounts or error changes
      return () => clearTimeout(timer);
    }
  }, [data.error, dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPersonalInfo((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleUsernameChange = (event) => {
    const { value } = event.target;
    setNewUsername(value);
    setPersonalInfo((prevState) => ({
      ...prevState,
      new_username: value
    }));
  };

  const profileUpload = async (file) => {
    dispatch({ type: 'AUTH_START' });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'campusconnect');
    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/campusconnect1234/image/upload',
        formData
      );
      return res.data.secure_url;
    } catch (error) {
      alert.error('Error uploading file:', error);
      return;
    }
  };

  const handleSubmit = async () => {
    if (personalInfo.firstname == '') alert('Firstname  is required');
    if (personalInfo.username == '') alert('Firstname  is required');
    const formData = new FormData();
    for (const key in personalInfo) {
      formData.append(key, personalInfo[key]);
    }
    if (file) {
      const img = await profileUpload(file);
      formData.set('profileImg', img);
    }

    dispatch(updateUser(formData));
  };

  const handleChangeToggle = () => {
    setIsChecked((prevState) => {
      const newCheckedState = !prevState;

      // Update personalInfo after the new state is toggled
      setPersonalInfo((prevStateInfo) => ({
        ...prevStateInfo,
        private: newCheckedState
      }));

      return newCheckedState;
    });
  };

  return (
    <div className="border relative flex flex-col m-10 p-10 rounded-2xl bg-white gap-5">
      {data.updateLoading && (
        <svg
          aria-hidden="true"
          className="w-8 h-8 fixed left:1/2 right-1/2 top-1/2 bottom-1/2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      )}
      {data.error && (
        <div className="flex text-white items-center justify-center z-40 bg-red-500 w-full h-12">
          {data.error.message}
        </div>
      )}
      <div className=" text-xl font-semibold w-full flex items-center justify-between ">
        <h1>My Profile</h1>

        <button
          onClick={handleSubmit}
          hidden={editProfile}
          className=" bg-green-500 text-white border rounded-full text-sm w-24 h-10 hover:bg-green-600 active:scale-95"
        >
          Submit
        </button>
      </div>
      <div className="flex border items-center justify-between rounded-2xl px-5">
        <div className="flex items-center gap-5">
          <div className="w-full  relative">
            <img
              src={
                file instanceof File
                  ? URL.createObjectURL(file)
                  : personalInfo.profileImg
              }
              className="w-20 h-20 rounded-full object-cover m-4 border"
              alt="Profile_img"
            />
            <input
              hidden={editProfile}
              type="file"
              accept="image/*"
              onChange={(event) => {
                if (event.target.files[0]) {
                  setFile(event.target.files[0]);
                }
              }}
              className="text-xs absolute top-0 "
            />
          </div>
          <div className="flex  flex-col gap-1 text-sm text-gray-800">
            <input
              type="text"
              value={personalInfo?.firstname + ' ' + personalInfo?.lastname}
              disabled={editProfile}
              name="name"
              className={`text-base outline-none pl-2 rounded-md ${
                editProfile ? '' : ' bg-slate-200'
              }`}
              onChange={handleChange}
            />
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newUsername}
                disabled={editProfile}
                name="newUsername"
                className={` outline-none pl-2 rounded-md ${
                  editProfile ? '' : ' bg-slate-200'
                }`}
                onChange={handleUsernameChange}
              />
            </div>
            <input
              type="text"
              value={personalInfo.email}
              disabled
              name="email"
              onChange={handleChange}
              className={` outline-none pl-2 rounded-md ${
                editProfile ? '' : ' bg-slate-200'
              }`}
            />

            <div className="checkbox-wrapper-35 ml-2 ">
              <input
                className="switch"
                type="checkbox"
                disabled={editProfile}
                id="switch"
                name="switch"
                value="private"
                checked={isChecked}
                onChange={handleChangeToggle}
              />
              <label htmlFor="switch">
                <span className="switch-x-text">Private </span>
                <span className="switch-x-toggletext">
                  <span className="switch-x-unchecked">
                    <span className="switch-x-hiddenlabel">Unchecked: </span>Off
                  </span>
                  <span className="switch-x-checked">
                    <span className="switch-x-hiddenlabel">Checked: </span>On
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setEditProfile((state) => !state);
          }}
          className="border px-4 h-8 cursor-pointer rounded-xl text-sm flex items-center shadow-sm hover:bg-slate-200 gap-2 transition-all duration-200 ease-linear"
        >
          Edit <CiEdit />
        </button>
      </div>
      <div className=" border rounded-xl px-10 py-5 ">
        <div className="flex items-center justify-between my-5 ">
          <h1 className=" text-lg">Personal Information</h1>
        </div>
        <div className="  w-5/6 py-2">
          <ul className=" grid grid-cols-2 gap-2">
            <li className="flex flex-col items-start mx-2 px-5 w-72">
              <p className=" text-gray-600 text-xs">First Name</p>

              <input
                type="text"
                value={personalInfo.firstname}
                disabled={editProfile}
                name="firstname"
                className={` outline-none pl-2 rounded-md ${
                  editProfile ? '' : ' bg-slate-200'
                }`}
                onChange={handleChange}
              />
            </li>
            <li className="flex flex-col items-start mx-2 px-5 w-72">
              <p className=" text-gray-600 text-xs">Last Name</p>
              <input
                type="text"
                value={personalInfo.lastname}
                disabled={editProfile}
                name="lastname"
                onChange={handleChange}
                className={` outline-none pl-2 rounded-md ${
                  editProfile ? '' : ' bg-slate-200'
                }`}
              />
            </li>
            <li className="flex flex-col items-start mx-2 px-5 w-72">
              <p className=" text-gray-600 text-xs">Email address</p>

              <input
                type="email"
                value={personalInfo.email}
                name="email"
                onChange={handleChange}
                className={` outline-none pl-2 rounded-md ${
                  editProfile ? '' : ' bg-slate-200'
                }`}
              />
            </li>
            <li className="flex flex-col items-start mx-2 px-5 w-72">
              <p className=" text-gray-600 text-xs">Phone</p>

              <input
                type="text"
                value={personalInfo.phone}
                name="phone"
                disabled={editProfile}
                onChange={handleChange}
                className={` outline-none pl-2 rounded-md ${
                  editProfile ? '' : ' bg-slate-200'
                }`}
              />
            </li>
            <li className="flex flex-col items-start mx-2 px-5 w-72">
              <p className=" text-gray-600 text-xs">About</p>
              <p>{user?.about}</p>
              <textarea
                type="text"
                value={personalInfo.bio}
                name="about"
                disabled={editProfile}
                onChange={handleChange}
                className={` outline-none pl-2 w-full rounded-md ${
                  editProfile ? '' : ' bg-slate-200'
                }`}
              />
            </li>
          </ul>
        </div>
      </div>

      <div className=" border rounded-xl  px-10 py-5 ">
        <div className="flex items-center justify-between my-5 ">
          <h1 className=" text-lg">Adress</h1>
        </div>
        <div className="  w-5/6 py-10">
          <ul className=" grid grid-cols-2 gap-2">
            <li className="flex flex-col items-start mx-2 px-5 w-72 ">
              <p className=" text-gray-600 text-xs">Country</p>

              <input
                type="text"
                value={personalInfo.country}
                disabled={editProfile}
                name="country"
                onChange={handleChange}
                className={` outline-none pl-2 rounded-md ${
                  editProfile ? '' : ' bg-slate-200'
                }`}
              />
            </li>
            <li className="flex flex-col items-start mx-2 px-5 w-72">
              <p className=" text-gray-600 text-xs">City/State</p>

              <input
                type="text"
                value={personalInfo.city}
                disabled={editProfile}
                name="city"
                onChange={handleChange}
                className={` outline-none pl-2 rounded-md ${
                  editProfile ? '' : ' bg-slate-200'
                }`}
              />
            </li>
            <li className="flex flex-col items-start mx-2 px-5 w-72">
              <p className=" text-gray-600 text-xs">Postal Code</p>

              <input
                type="number"
                value={personalInfo.postalCode}
                disabled={editProfile}
                name="postalCode"
                onChange={handleChange}
                className={` outline-none pl-2 rounded-md ${
                  editProfile ? '' : ' bg-slate-200'
                }`}
              />
            </li>
            <li className="flex flex-col items-start mx-2 px-5 w-72">
              <p className=" text-gray-600 text-xs">TAX ID</p>

              <input
                type="text"
                value={personalInfo.taxId}
                disabled={editProfile}
                name="taxId"
                onChange={handleChange}
                className={` outline-none pl-2 rounded-md ${
                  editProfile ? '' : ' bg-slate-200'
                }`}
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
