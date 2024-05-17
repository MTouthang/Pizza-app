import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../Layout/Layout';
import { getProductDetails, updateProduct } from '../../Redux/ProductSlice';

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formProduct, setFormProduct] = useState({
    productName: '',
    description: '',
    productImage: null,
    price: '',
    category: '',
    quantity: '',
    inStock: true,
  });

  const [productsData, setProductData] = useState();

  useEffect(() => {
    (async () => {
      const res = await dispatch(getProductDetails(id)); // Dispatch action to fetch product details
      if (res.payload) {
        setProductData(res?.payload);
      }
    })();
  }, [id, dispatch]);

  useEffect(() => {
    // Populate form fields when productsData is updated
    if (productsData) {
      setFormProduct({
        productName: productsData.productName || '',
        description: productsData.description || '',
        price: productsData.price || '',
        category: productsData.category || '',
        quantity: productsData.quantity || 0,
        inStock: productsData.inStock || true,
      });
    }
  }, [productsData]);

  const [prevImage, setPrevImage] = useState(
    productsData?.productImage?.url || ''
  );

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
    const res = await dispatch(updateProduct({ id, productFormData }));
    // navigate to admin dashboard
    if (res?.payload) {
      navigate('/admin');
    }
  };

  return (
    <Layout>
      <section className="py-12 ">
        <div className="max-w-md mx-auto mt-8 bg-white p-7 ">
          <h2 className="mb-4 text-2xl font-semibold">
            Update Product details
          </h2>
          <form onSubmit={productDataSubmission}>
            <div className="mb-4">
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700"
              >
                Product Name
              </label>
              <input
                type="text"
                required
                id="productName"
                name="productName"
                value={formProduct.productName}
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
                value={formProduct?.description}
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
                Price
              </label>
              <input
                type="number"
                required
                id="price"
                name="price"
                value={formProduct?.price}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label className="mb-2 ">Select Category:</label>
              <select
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleInputChange}
                name="category"
                value={formProduct?.category}
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
                Product Quantity
              </label>
              <input
                type="number"
                required
                id="quantity"
                name="quantity"
                value={formProduct?.quantity}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* stock */}
            <div className="flex flex-col mb-4">
              <label className="mb-2 ">Item in Stock:</label>
              <select
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleInputChange}
                name="inStock"
                value={formProduct.inStock}
              >
                <option value="" className="bg-yellow-500">
                  Select
                </option>
                <option value="true">Product Item Available</option>
                <option value="false">Product Item Out of Stock</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium text-gray-700"
              >
                Product Image{' '}
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
            {prevImage ? (
              <img
                src={prevImage}
                alt="product preview"
                className="w-20 h-20 mx-auto mb-4"
              />
            ) : (
              <img
                src={productsData?.productImage?.url}
                alt="product preview"
                className="w-20 h-20 mx-auto mb-4"
              />
            )}
            <button
              type="submit"
              className="w-full py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update product
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default EditProduct;
