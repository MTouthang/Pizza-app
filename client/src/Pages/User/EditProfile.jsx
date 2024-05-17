import React, { useState } from 'react';
import { Layout } from '../../Layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData, updateProfile } from '../../Redux/AuthSlice';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state?.auth?.data);
  const [previewImage, setImagePreview] = useState(userData?.avatar?.url || '');

  const [formData, setFormData] = useState({
    firstName: userData.firstName || 'NA',
    lastName: userData.lastName || 'NA',
    mobileNumber: userData.mobileNumber || 'NA',
    avatar: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);

    setFormData((prevData) => ({
      ...prevData,
      avatar: file,
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    //TODO: data validate data length

    //   create formData from existing data
    const tempFormData = new FormData();

    tempFormData.append('firstName', formData.firstName);
    tempFormData.append('lastName', formData.lastName);
    tempFormData.append('mobileNumber', formData.mobileNumber);

    if (formData.avatar instanceof File) {
      tempFormData.append('avatar', formData.avatar);
    }
    const res = await dispatch(updateProfile(tempFormData));

    // fetch the data to update
    await dispatch(getUserData());

    if (res?.payload?.success) {
      navigate('/user/profile');
    }
  };

  return (
    <Layout>
      <section className=" py-28">
        <div className="max-w-md mx-auto mt-8 bg-white p-7 ">
          <h2 className="mb-4 text-2xl font-semibold">Update User Profile</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                minLength={5}
                maxLength={20}
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                minLength={5}
                maxLength={20}
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                minLength={10}
                maxLength={12}
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Image{' '}
                <span className="text-red-600">(.jpg, .jpeg and .png)</span>
              </label>
              <input
                type="file"
                id="profileImage"
                name="avatar"
                accept=".jpg, .jpeg, .png"
                onChange={handleImageChange}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {previewImage && (
              <img
                src={previewImage}
                alt="profile preview"
                className="w-20 h-20 mx-auto mb-4 rounded-full"
              />
            )}
            <button
              type="submit"
              className="w-full py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default EditProfile;
