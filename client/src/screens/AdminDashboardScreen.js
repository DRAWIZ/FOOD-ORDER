import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardStats } from '../actions/dashboardActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const AdminDashboardScreen = () => {
  const dispatch = useDispatch();
  
  const dashboardStats = useSelector((state) => state.dashboardStats);
  const { loading, error, stats } = dashboardStats;
  
  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-800">Admin Dashboard</h1>
      </div>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : !stats ? (
        <Message>No dashboard data available</Message>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-gray-600 text-sm">Total Users</h2>
                  <p className="text-2xl font-semibold text-primary-800">{stats.users.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-gray-600 text-sm">Today's Orders</h2>
                  <p className="text-2xl font-semibold text-primary-800">{stats.orders.today}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-gray-600 text-sm">Monthly Orders</h2>
                  <p className="text-2xl font-semibold text-primary-800">{stats.orders.monthly}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-gray-600 text-sm">Today's Revenue</h2>
                  <p className="text-2xl font-semibold text-primary-800">${stats.revenue.today.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 md:col-span-1">
              <h2 className="text-xl font-semibold text-primary-800 mb-4">Order Status</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600">Pending</span>
                    <span className="text-sm font-medium text-primary-700">{stats.orders.pending}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (stats.orders.pending /
                            (stats.orders.pending +
                              stats.orders.preparing +
                              stats.orders.completed)) *
                          100
                        }%`
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600">Preparing</span>
                    <span className="text-sm font-medium text-primary-700">{stats.orders.preparing}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (stats.orders.preparing /
                            (stats.orders.pending +
                              stats.orders.preparing +
                              stats.orders.completed)) *
                          100
                        }%`
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600">Completed</span>
                    <span className="text-sm font-medium text-primary-700">{stats.orders.completed}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (stats.orders.completed /
                            (stats.orders.pending +
                              stats.orders.preparing +
                              stats.orders.completed)) *
                          100
                        }%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
              <h2 className="text-xl font-semibold text-primary-800 mb-4">Top Selling Products</h2>
              
              {stats.topProducts && stats.topProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Product</th>
                        <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Price</th>
                        <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Sold</th>
                        <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.topProducts.map((product) => (
                        <tr key={product._id} className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm">{product.name}</td>
                          <td className="py-3 px-4 text-sm text-right">${product.price.toFixed(2)}</td>
                          <td className="py-3 px-4 text-sm text-right">{product.count}</td>
                          <td className="py-3 px-4 text-sm text-right">
                            ${(product.price * product.count).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No product data available</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-primary-800">Recent Orders</h2>
                <Link
                  to="/admin/orders"
                  className="text-secondary-500 hover:text-secondary-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              
              <Link
                to="/admin/orders"
                className="inline-block px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50"
              >
                Manage Orders
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardScreen;