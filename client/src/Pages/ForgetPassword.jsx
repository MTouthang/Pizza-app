import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { forgetPassword } from '../Redux/AuthSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const [sendStatus, setSendStatus] = useState(false);
  const [email, setEmail] = useState();
  const dispatch = useDispatch();

  console.log(email);
  const handleForgetPassword = async (e) => {
    e.preventDefault();
    const res = await dispatch(forgetPassword(email));
    if (res.payload) {
      setSendStatus(true);
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

          <p className="leading-relaxed text-center">
            Please enter your correct email address to reset your password
          </p>

          {sendStatus ? (
            <p className="leading-relaxed text-center">
              Reset-URL is sent successfully, please check your mail, The URL is
              valid for only 10 minute
            </p>
          ) : (
            <form
              onSubmit={handleForgetPassword}
              className="flex flex-col items-end w-full px-8 mx-auto space-y-4 lg:w-3/4 sm:flex-row sm:space-x-4 sm:space-y-0 sm:px-0"
            >
              <div className="relative flex-grow w-full">
                <label
                  htmlFor="email"
                  className="text-sm leading-7 text-gray-600"
                >
                  Email ID
                </label>
                <input
                  type="email"
                  required
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-gray-100 bg-opacity-50 border border-gray-300 rounded outline-none focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 text-lg text-white bg-yellow-500 border-0 rounded focus:outline-none hover:bg-yellow-600"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default ForgetPassword;
