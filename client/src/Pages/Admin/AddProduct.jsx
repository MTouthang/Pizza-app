import React, { useState } from 'react';
import { Layout } from '../../Layout/Layout';
import { useDispatch } from 'react-redux';
import { createNewProduct } from '../../Redux/ProductSlice';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formProduct, setFormProduct] = useState({
    productName: '',
    description: '',
    productImage: null,
    price: '',
    category: '',
    quantity: '',
    inStock: true,
  });

  const [prevImage, setPrevImage] = useState();

  //   change the value and the data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormProduct((prevData) => ({ ...prevData, [name]: value }));
  };

  // handle image --
  const handleImageUploadPrev = (e) => {
    // get file from input
    const file = e.target?.files[0];
    console.log(file);

    setFormProduct((prevData) => ({
      ...prevData,
      productImage: file,
    }));

    // get and preview
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log(reader);
      setPrevImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setPrevImage('');
    }
  };

  const productDataSubmission = async (e) => {
    e.preventDefault();

    // create formData from existing data
    const productFormData = new FormData();

    productFormData.append('productName', formProduct.productName);
    productFormData.append('description', formProduct.description);

    productFormData.append('price', formProduct.price);
    productFormData.append('category', formProduct.category);
    productFormData.append('quantity', formProduct.quantity);
    productFormData.append('inStock', formProduct.inStock);

    if (formProduct.productImage instanceof File) {
      productFormData.append('productImage', formProduct.productImage);
    }

    // call the dispatch function to upload the product data
    const res = await dispatch(createNewProduct(productFormData));

    // navigate to admin dashboard
    if (res?.payload?.success) {
      navigate('/admin');
    }
  };

  return (
    <Layout>
      <section className="py-12 ">
        <div className="max-w-md mx-auto mt-8 bg-white p-7 ">
          <h2 className="mb-4 text-2xl font-semibold">Add Product</h2>
          <form onSubmit={productDataSubmission}>
            <div className="mb-4">
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700"
              >
                Product Name <span className="text-red-500"> * </span>
              </label>
              <input
                type="text"
                required
                id="productName"
                name="productName"
                minLength={5}
                maxLength={20}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                minLength={5}
                maxLength={60}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price <span className="text-red-500"> * </span>
              </label>
              <input
                type="number"
                required
                id="price"
                name="price"
                onChange={handleInputChange}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label className="mb-2 ">
                Select Category: <span className="text-red-500"> * </span>
              </label>
              <select
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleInputChange}
                name="category"
              >
                <option value="" className="bg-yellow-500">
                  Select Category
                </option>
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="drink">Drink</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Product Quantity <span className="text-red-500"> * </span>
              </label>
              <input
                type="number"
                required
                id="quantity"
                name="quantity"
                onChange={handleInputChange}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium text-gray-700"
              >
                Product Image{' '}
                <span className="text-red-600">(.jpg, .jpeg and .png)</span>
              </label>
              <input
                type="file"
                id="productImage"
                name="productImage"
                accept=".jpg, .jpeg, .png"
                onChange={handleImageUploadPrev}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {prevImage && (
              <img
                src={prevImage}
                alt="profile preview"
                className="w-20 h-20 mx-auto mb-4 rounded-full"
              />
            )}
            <button
              type="submit"
              className="w-full py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add product
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default AddProduct;
