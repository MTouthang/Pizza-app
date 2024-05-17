import React, { useState, useEffect } from 'react';
import orderImage from '../../assets/images/ordered-success.png';
import { Layout } from '../../Layout/Layout';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const navigateHome = () => {
    navigate('/', { replace: true });
  };
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center py-28">
        <img
          src={orderImage}
          alt="order success illustration"
          width={400}
          height={400}
        />
        <p className="text-lg font-semibold">Order placed Successful!</p>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 py-2 px-3 rounded-md"
          onClick={navigateHome}
        >
          {' '}
          Go back Home
        </button>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
