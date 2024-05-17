import React, { useEffect, useState } from 'react';
import { Layout } from '../../Layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../../Redux/OrderSlice';
import toast from 'react-hot-toast';
import { getCartDetails } from '../../Redux/CartSlice';

const Order = () => {
  const { cartsData } = useSelector((state) => state?.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [detail, setDetail] = useState({
    paymentMethod: '',
    address: ' ',
  });
  useEffect(() => {
    (async () => {
      await dispatch(getCartDetails());
    })();
  }, [dispatch]);

  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setDetail({
      ...detail,
      [name]: value,
    });
  };

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    if (detail.paymentMethod == '') {
      toast.error('Payment method field missing');
      return;
    }
    await dispatch(placeOrder({ cartId: cartsData?._id, detail }));

    toast.success('Order placed successfully');
    navigate('/order/success', { replace: true });
  };

  return (
    <Layout>
      <section class="text-gray-600 body-font min-h-56">
        <div class="container px-5 py-24 mx-auto">
          <div class="flex flex-col text-center w-full mb-12">
            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              {' '}
              Thanks for Choosing us{' '}
            </h1>
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
              Total Price -
              <span className="font-bold text-red-400">
                ₹{cartsData?.totalPrice}/-
              </span>{' '}
            </p>
          </div>
          <form
            onSubmit={(e) => placeOrderHandler(e)}
            class="flex lg:w-3/4 w-full sm:flex-row flex-col mx-auto px-8 sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-end"
          >
            <div class="relative flex-grow w-full">
              <label
                for="paymentMethod"
                class="leading-7 text-sm text-gray-600"
              >
                PaymentMethod
              </label>
              <select
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleUserInput}
                name="paymentMethod"
                required
              >
                <option className="bg-yellow-500">Select PaymentMethod</option>
                <option value="ONLINE"> Online </option>
                <option value="OFFLINE"> Offline </option>
              </select>
            </div>
            <div class="relative flex-grow w-full">
              <label for="address" class="leading-7 text-sm text-gray-600">
                Address
              </label>
              <input
                type="text"
                required
                placeholder="Enter your address"
                onChange={handleUserInput}
                id="address"
                name="address"
                class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <button
              type="submit"
              class="text-white bg-yellow-500 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded text-sm"
            >
              Place Order
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Order;
