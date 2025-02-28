import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderByToken } from '../actions/orderActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const TokenLookupScreen = () => {
  const [token, setToken] = useState('');
  const [searched, setSearched] = useState(false);
  
  const dispatch = useDispatch();
  
  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, error, order } = orderDetails;
  
  useEffect(() => {
    // Reset order details when component mounts
    return () => {
      setSearched(false);
    };
  }, []);
  
  const submitHandler = (e) => {
    e.preventDefault();
    if (token.trim()) {
      dispatch(getOrderByToken(token.trim()));
      setSearched(true);
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
  
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Order Received';
      case 'preparing':
        return 'Preparing';
      case 'completed':
        return 'Ready for Pickup';
      default:
        return status;
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-primary-800 mb-6">Track Your Order</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={submitHandler}>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter your token number"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50"
            >
              Track Order
            </button>
          </div>
        </form>
      </div>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : searched && !order ? (
        <Message variant="danger">Order not found. Please check your token number and try again.</Message>
      ) : order && searched ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary-700 text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Order #{order.tokenNumber}</h2>
            <p className="text-sm opacity-80">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-primary-800 mb-2">Order Status</h3>
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                    order.status
                  )}`}
                >
                  {getStatusText(order.status)}
                </span>
                
                {order.status === 'pending' && (
                  <span className="ml-2 text-sm text-gray-500">
                    Your order has been received and will be prepared soon.
                  </span>
                )}
                
                {order.status === 'preparing' && (
                  <span className="ml-2 text-sm text-gray-500">
                    Your order is being prepared and will be ready soon.
                  </span>
                )}
                
                {order.status === 'completed' && (
                  <span className="ml-2 text-sm text-gray-500">
                    Your order is ready for pickup! Please show your token number.
                  </span>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-primary-800 mb-2">Order Details</h3>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <div className="flex justify-between text-sm font-medium text-gray-500">
                    <span>Item</span>
                    <span>Subtotal</span>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="px-4 py-3 flex justify-between">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TokenLookupScreen;