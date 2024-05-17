import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { resetPassword } from '../../Redux/AuthSlice';

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [status, setStatus] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    console.log(password, confirmPassword);
    if (password != confirmPassword) {
      toast.error('Confirm password does not match');
      return;
    }

    if (token) {
      const res = await dispatch(resetPassword({ token, password }));
      res.payload ? setStatus(true) : setStatus(false);
    }
  };

  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col w-full mb-12 text-center">
            <h1 className="mb-4 text-2xl font-medium text-gray-900 sm:text-3xl title-font">
              Pizza App 🍕
            </h1>
          </div>

          {status ? (
            <>
              <p className="px-5 leading-relaxed text-center">
                Password Reset successfully,
              </p>
              <Link
                to="/login"
                className="flex justify-center text-yellow-500 cursor-pointer hover:text-yellow-600"
              >
                {' '}
                Click to Login
              </Link>
            </>
          ) : (
            <>
              <p className="px-5 leading-relaxed text-center lg:w-3/4">
                Enter new password, To reset your password
              </p>
              <form
                onSubmit={handleResetPassword}
                className="flex flex-col items-end w-full px-8 mx-auto space-y-4 lg:w-3/4 sm:flex-row sm:space-x-4 sm:space-y-0 sm:px-0"
              >
                <div className="relative flex-grow w-full">
                  <label
                    htmlFor="password"
                    className="text-sm leading-7 text-gray-600"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    id="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-gray-100 bg-opacity-50 border border-gray-300 rounded outline-none focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
                <div className="relative flex-grow w-full">
                  <label
                    htmlFor="cPassword"
                    className="text-sm leading-7 text-gray-600"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="cPassword"
                    required
                    id="cPassword"
                    name="cPassword"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-gray-100 bg-opacity-50 border border-gray-300 rounded outline-none focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 mx-auto text-lg text-white bg-yellow-500 border-0 rounded focus:outline-none hover:bg-yellow-600"
                >
                  Reset
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default ResetPassword;
