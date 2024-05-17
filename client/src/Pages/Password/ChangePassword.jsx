import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '../../Layout/Layout';
import { changePassword } from '../../Redux/AuthSlice';
import toast from 'react-hot-toast';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userPassword, setUserPassword] = useState({
    oldPassword: '',
    newPassword: '',
  });

  // function to handle input box change
  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setUserPassword({
      ...userPassword,
      [name]: value,
    });
  };

  // function to handle form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // checking the fields are empty or not
    if (!userPassword.oldPassword || !userPassword.newPassword) {
      toast.error('All fields are mandatory');
      return;
    }

    // validating the password using regex
    if (
      !userPassword.newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)
    ) {
      toast.error(
        'Minimum password length should be 6 with Uppercase, Lowercase, Number and Symbol'
      );
      return;
    }

    // calling the api from auth slice
    const res = await dispatch(changePassword(userPassword));

    // clearing the input fields
    setUserPassword({
      oldPassword: '',
      newPassword: '',
    });

    // redirecting to profile page if password changed
    if (res.payload.success) navigate('/user/profile');
  };

  return (
    <>
      <Layout>
        {/* forget password container */}
        <div className="flex items-center justify-center h-[100vh] text-black">
          {/* forget password card */}
          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col justify-center gap-6 rounded-lg p-4 text-white w-80 h-[26rem] border"
          >
            <h1 className="text-2xl font-bold text-center text-black">
              Change Password
            </h1>

            <div className="flex flex-col gap-1">
              <label
                className="text-lg font-semibold text-black "
                htmlFor="oldPassword"
              >
                Old Password
              </label>
              <input
                required
                type="password"
                name="oldPassword"
                id="oldPassword"
                placeholder="Enter your old password"
                className="px-2 py-1 text-black bg-transparent border"
                value={userPassword.oldPassword}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-lg font-semibold text-black"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <input
                required
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="Enter your new password"
                className="px-2 py-1 text-black bg-transparent border"
                value={userPassword.newPassword}
                onChange={handlePasswordChange}
              />
            </div>

            <Link to={'/user/profile'}>
              <p className="flex items-center justify-center w-full gap-2 text-black cursor-pointer link text-accent">
                Back to Profile
              </p>
            </Link>

            <button
              className="w-full py-2 text-lg font-semibold transition-all duration-300 ease-in-out bg-yellow-600 rounded-sm cursor-pointer hover:bg-yellow-700"
              type="submit"
            >
              Change Password
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default ChangePassword;