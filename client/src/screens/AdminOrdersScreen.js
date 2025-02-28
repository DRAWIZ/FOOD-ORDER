import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders, updateOrderStatus } from '../actions/orderActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const AdminOrdersScreen = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  
  const dispatch = useDispatch();
  
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;
  
  const orderStatusUpdate = useSelector((state) => state.orderStatusUpdate);
  const { loading: loadingUpdate, success: successUpdate, error: errorUpdate } = orderStatusUpdate;
  
  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch, successUpdate]);
  
  const updateStatusHandler = (id, status) => {
    if (window.confirm('Are you sure you want to update the status?')) {
      dispatch(updateOrderStatus(id, status));
    }
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Filter orders based on status
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-800">Orders</h1>
      </div>
      
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-md ${
              statusFilter === 'all'
                ? 'bg-primary-700 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-md ${
              statusFilter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('preparing')}
            className={`px-4 py-2 rounded-md ${
              statusFilter === 'preparing'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            Preparing
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-4 py-2 rounded-md ${
              statusFilter === 'completed'
                ? 'bg-green-500 text-white'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            Completed
          </button>
        </div>
      </div>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-primary-800">
                          {order.tokenNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{order.user?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.user?.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${order.totalPrice.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/admin/order/${order._id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View
                          </Link>
                          
                          {order.status === 'pending' && (
                            <button
                              onClick={() => updateStatusHandler(order._id, 'preparing')}
                              className="text-blue-600 hover:text-blue-900"
                              disabled={loadingUpdate}
                            >
                              Prepare
                            </button>
                          )}
                          
                          {order.status === 'preparing' && (
                            <button
                              onClick={() => updateStatusHandler(order._id, 'completed')}
                              className="text-green-600 hover:text-green-900"
                              disabled={loadingUpdate}
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersScreen;