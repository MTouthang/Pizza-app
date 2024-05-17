import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getAllProducts } from '../../Redux/ProductSlice';
import { Layout } from '../../Layout/Layout';

import { deleteUser, getAllOrders, getAllUsers } from '../../Redux/AdminSlice';
import { Link } from 'react-router-dom';

const DashBoard = () => {
  const dispatch = useDispatch();
  const { productsData } = useSelector((state) => state?.product);
  const usersData = useSelector((state) => state?.adminData);
  const { ordersData } = useSelector((state) => state?.adminData);
  const [toggle, setToggle] = useState('products');
  useEffect(() => {
    (async () => {
      await dispatch(getAllProducts({ limitValue: '', categoryValue: '' }));
    })();
  }, [toggle, dispatch]);

  const handleGetAllUser = async () => {
    const res = await dispatch(getAllUsers());
    if (res.payload) {
      setToggle('users');
    }
  };
  const handleViewProducts = () => {
    setToggle('products');
  };

  const handleViewAllOrders = async () => {
    const res = await dispatch(getAllOrders());

    if (res.payload) {
      setToggle('orders');
    }
  };

  // handle product delete
  const handleProductDelete = async (id) => {
    const confirmed = window.confirm(
      'Are your you want to delete this Product ?'
    );
    if (confirmed) {
      const res = await dispatch(deleteProduct(id));
      if (res.payload) {
        await dispatch(getAllProducts({ limitValue: '', categoryValue: '' }));
      }
    }
  };

  // handle user delete
  const handleUserDelete = async (id) => {
    const confirm = window.confirm(
      'Are you sure you want to delete the user ?'
    );
    if (confirm) {
      const res = await dispatch(deleteUser(id));
      if (res.payload) {
        handleGetAllUser();
      }
    }
  };

  return (
    <Layout>
      <section className="p-3 bg-gradient-to-r from-amber-50 to-orange-300 sm:p-5">
        <div className="max-w-screen-xl px-4 mx-auto text-gray-700 lg:px-12">
          <div className="relative overflow-hidden bg-white shadow-md sm:rounded-lg">
            <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
              <h3 className="text-2xl font-bold"> Admin Dashboard </h3>
              <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
                <Link
                  to={'/admin/add-product'}
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-lg hover:bg-yellow-500 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                >
                  <svg
                    className="h-3.5 w-3.5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    />
                  </svg>
                  Add product
                </Link>
                <div className="flex items-center w-full space-x-3 md:w-auto">
                  <button
                    className={`flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900  border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 ${toggle == 'products' ? 'bg-yellow-500 text-white' : 'bg-white'} hover:bg-yellow-500 border`}
                    type="button"
                    onClick={handleViewProducts}
                  >
                    View Products
                  </button>
                  <button
                    className={`flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900  border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 ${toggle == 'users' ? 'bg-yellow-500 text-white' : 'bg-white'} hover:bg-yellow-500 border`}
                    type="button"
                    onClick={handleGetAllUser}
                  >
                    View Users
                  </button>

                  <button
                    id="filterDropdownButton"
                    data-dropdown-toggle="filterDropdown"
                    className={`flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900  border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 ${toggle == 'orders' ? 'bg-yellow-500 text-white' : 'bg-white'} hover:bg-yellow-500 border`}
                    type="button"
                    onClick={handleViewAllOrders}
                  >
                    View Orders
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {/* product list */}
              {toggle === 'products' && productsData && (
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-yellow-500 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        Product name
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Category
                      </th>
                      <th scope="col" className="px-4 py-3">
                        In Stock
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Unit Price
                      </th>
                      <th scope="col" className="px-4 py-3"></th>
                      <th scope="col" className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsData.map((item, key) => (
                      <tr key={key} className="border-b dark:border-gray-300">
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap "
                        >
                          {item.productName}
                        </th>
                        <td className="px-4 py-3">{item.category}</td>
                        <td className="px-4 py-3">{item.quantity}</td>
                        <td className="px-4 py-3">{item.price}</td>
                        <td className="px-4 py-3 cursor-pointer hover:text-yellow-600">
                          <Link to={`/admin/edit-product/${item?._id}`}>
                            Update Product
                          </Link>
                        </td>
                        <td
                          className="px-4 py-3 cursor-pointer hover:text-red-500"
                          onClick={() => handleProductDelete(item._id)}
                        >
                          {' '}
                          Delete Product
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* users data */}
              {toggle === 'users' && usersData && (
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-yellow-500 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        First Name
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Email
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Mobile Number
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Role
                      </th>
                      <th scope="col" className="px-4 py-3"></th>
                      <th scope="col" className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData?.allUsers.map((item, key) => (
                      <tr key={key} className="border-b dark:border-gray-300">
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap "
                        >
                          {item.firstName}
                        </th>
                        <td className="px-4 py-3">{item.email}</td>
                        <td className="px-4 py-3">{item.mobileNumber}</td>
                        <td className="px-4 py-3">{item.role}</td>
                        <td className="px-4 py-3 cursor-pointer hover:text-yellow-600">
                          <Link to={`/admin/edit-user/${item?._id}`}>
                            Update User
                          </Link>
                        </td>
                        <td
                          className="px-4 py-3 cursor-pointer hover:text-red-500"
                          onClick={() => handleUserDelete(item._id)}
                        >
                          {' '}
                          Delete User
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* ordes list */}

              {toggle === 'orders' && usersData?.allOrders && (
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-yellow-500 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        Order Id
                      </th>
                      <th scope="col" className="px-4 py-3">
                        payment Method
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Address
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3"></th>
                      <th scope="col" className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData?.allOrders.map((item, key) => (
                      <tr key={key} className="border-b dark:border-gray-300">
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap "
                        >
                          {item._id}
                        </th>
                        <td className="px-4 py-3">{item.paymentMethod}</td>
                        <td className="px-4 py-3">{item.address}</td>
                        <td className="px-4 py-3">{item.status}</td>
                        <td className="px-4 py-3 cursor-pointer hover:text-red-500">
                          {' '}
                          Total price - ₹{item?.totalPrice}/-
                        </td>
                        <td className="px-4 py-3 cursor-pointer hover:text-yellow-600">
                          <Link to={`/admin/update-order/${item?._id}`}>
                            Update Order
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DashBoard;
