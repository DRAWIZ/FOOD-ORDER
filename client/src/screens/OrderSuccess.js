import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../actions/orderActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const OrderSuccessScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, error, order } = orderDetails;
  
  useEffect(() => {
    if (!order || order._id !== id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, order, id]);
  
  return (
    <div className="max-w-2xl mx-auto py-8">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-primary-800 mb-4">Order Placed Successfully!</h1>
          
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-primary-700 mb-2">Your Token Number</h2>
            <div className="text-3xl font-bold text-secondary-600 mb-2">{order.tokenNumber}</div>
            <p className="text-gray-600 text-sm">
              Please show this token when you pick up your order
            </p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-primary-700 mb-3">Order Summary</h2>
            
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
          
          <div className="flex justify-center">
            <Link
              to="/"
              className="px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSuccessScreen;