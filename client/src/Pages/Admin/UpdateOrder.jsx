import React, { useState, useEffect } from 'react';
import { Layout } from '../../Layout/Layout';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  deleteOrder,
  getOrderDetails,
  updateOrder,
} from '../../Redux/OrderSlice';

const UpdateOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formOrder, setFormOrder] = useState({
    address: '',
    paymentMethod: '',
    totalPrice: '',
    status: '',
  });

  const [orderData, setOrderData] = useState();

  useEffect(() => {
    (async () => {
      const res = await dispatch(getOrderDetails(id)); // Dispatch action to fetch product details
      if (res.payload) {
        setOrderData(res?.payload);
      }
    })();
  }, [id, dispatch]);

  useEffect(() => {
    // Populate form fields when orderData is updated
    if (orderData) {
      setFormOrder({
        address: orderData?.address || '',
        paymentMethod: orderData?.paymentMethod || '',
        totalPrice: orderData?.totalPrice || '',
        status: orderData?.status,
      });
    }
  }, [orderData]);

  //   change the value and the data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormOrder((prevData) => ({ ...prevData, [name]: value }));
  };

  //   submission form handle
  const updateOrderSubmission = async (e) => {
    e.preventDefault();

    // call the dispatch function to upload the product data
    const res = await dispatch(updateOrder({ id, formOrder }));
    // navigate to admin dashboard
    if (res.payload) {
      navigate('/admin');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete it');

    if (confirm) {
      const res = await dispatch(deleteOrder(id));
      if (res.payload) {
        navigate('/admin');
      }
    }
  };

  return (
    <Layout>
      <section className="py-12 ">
        <form
          className="max-w-md mx-auto mt-8 bg-white p-7 "
          onSubmit={updateOrderSubmission}
        >
          <h2 className="mb-4 text-2xl font-semibold">
            Update Product order details
          </h2>

          <div className="flex justify-between mb-4">
            <p className="block text-sm font-medium text-gray-700 ">
              Order Id - {orderData?._id}
            </p>
            <p
              onClick={() => handleDelete(orderData?._id)}
              className="px-1 text-red-500 border rounded-md cursor-pointer hover:shadow-md"
            >
              {' '}
              Delete order
            </p>
          </div>
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Delivery Address -{' '}
              <span className="text-red-400"> (change with caution )</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formOrder.address}
              minLength={5}
              maxLength={60}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="mb-2 ">Select Category:</label>
            <select
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange}
              name="paymentMethod"
              value={formOrder?.paymentMethod}
            >
              <option value="" className="bg-yellow-500">
                Select option
              </option>
              <option value="ONLINE">ONLINE PAYMENT</option>
              <option value="OFFLINE">OFFLINE PAYMENT</option>
            </select>
          </div>
          <div className="flex flex-col mb-4">
            <label className="mb-2 ">Select status:</label>
            <select
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange}
              name="status"
              value={formOrder?.status}
            >
              <option className="bg-yellow-500">Select option</option>
              <option value="ORDERED">ORDERED</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
          <div className="mb-4">
            <p className="block font-medium text-gray-700">
              Total price - ₹{orderData?.totalPrice}/-
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update product
          </button>
        </form>
      </section>
    </Layout>
  );
};

export default UpdateOrder;
