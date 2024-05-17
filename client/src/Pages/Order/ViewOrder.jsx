import React, { useEffect, useState } from 'react';

import { Layout } from '../../Layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { cancelOrder, loggedInUserOrder } from '../../Redux/OrderSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ViewOrder = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserOrder = async () => {
      try {
        const response = await dispatch(loggedInUserOrder());

        if (response.payload) {
          setOrders(response.payload); // Update orders state with fetched data
        }
      } catch (error) {
        toast.error('Not able to get order data');
      }
    };

    fetchUserOrder(); // Call the fetchUserOrder function inside useEffect
  }, [dispatch]);

  const handleOrderCancel = async (id) => {
    // Show alert with "Yes" or "No" options
    const userConfirmed = window.confirm(
      'Are you sure you want to cancel your order?'
    );

    // Check user's response
    if (userConfirmed) {
      const res = await dispatch(cancelOrder({ id: id, status: 'CANCELLED' }));
      if (res.payload) {
        navigate('/');
      }
    }
  };

  return (
    <Layout>
      {orders.length > 0 ? (
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-10 mx-auto">
            <div className="flex flex-col w-full mb-20 text-center">
              <h1 className="text-3xl font-medium text-gray-900 sm:text-4xl title-font">
                My Orders
              </h1>
            </div>
            {orders.map((orderItem, key) => (
              <div className="border " key={key}>
                <div className="w-full mx-auto overflow-auto lg:w-2/3">
                  <p className="mt-10"> Placed Order No. 00{key + 1}</p>
                  <table className="w-full text-left whitespace-no-wrap table-auto">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-sm font-medium tracking-wider text-gray-900 bg-gray-100 rounded-tl rounded-bl title-font">
                          item no.
                        </th>
                        <th className="px-4 py-3 text-sm font-medium tracking-wider text-gray-900 bg-gray-100 title-font">
                          Product Name
                        </th>
                        <th className="px-4 py-3 text-sm font-medium tracking-wider text-gray-900 bg-gray-100 title-font">
                          Category
                        </th>
                        <th className="px-4 py-3 text-sm font-medium tracking-wider text-gray-900 bg-gray-100 title-font">
                          Address
                        </th>
                        <th className="w-10 text-sm font-medium tracking-wider text-gray-900 bg-gray-100 rounded-tr rounded-br title-font">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItem?.items.map((item, key) => (
                        <tr key={key}>
                          <td className="px-4 py-3">{key + 1}</td>
                          <td className="px-4 py-3">{item?.productName}</td>
                          <td className="px-4 py-3 text-lg text-gray-900">
                            {item?.price}
                          </td>
                          <td className="px-4 py-3 truncate">
                            {orderItem?.address}
                          </td>

                          <td className="w-10 text-center">
                            {orderItem?.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between w-full mx-auto mt-4 lg:w-2/3">
                  {/* pass order id */}
                  {orderItem.status == 'CANCELLED' ? (
                    <p className="py-2 text-yellow-600">
                      {' '}
                      This order is being cancelled!
                    </p>
                  ) : (
                    <button
                      onClick={() => handleOrderCancel(orderItem._id)}
                      className="flex px-6 py-2 mb-4 text-white bg-yellow-500 border-0 rounded focus:outline-none hover:bg-red-600"
                    >
                      Cancel Order
                    </button>
                  )}

                  <p className="inline-flex items-center font-medium text-yellow-500 md:mb-2 lg:mb-0">
                    Total amount - {orderItem.totalPrice}
                  </p>
                </div>
                <hr className="p-2" />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="mt-6 text-gray-900">Order Not available</div>
      )}
    </Layout>
  );
};

export default ViewOrder;
