import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../actions/cartActions';
import Message from '../components/Message';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };
  
  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/login?redirect=cart');
    } else {
      navigate('/order/confirm');
    }
  };
  
  const increaseQuantity = (id, quantity) => {
    dispatch(addToCart(id, quantity + 1));
  };
  
  const decreaseQuantity = (id, quantity) => {
    if (quantity > 1) {
      dispatch(addToCart(id, quantity - 1));
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-800 mb-6">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <Message>
          Your cart is empty.{' '}
          <Link to="/" className="text-secondary-500 hover:text-secondary-600">
            Go Back
          </Link>
        </Message>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.product} className="p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-16 h-16">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <Link
                          to={`/product/${item.product}`}
                          className="text-lg font-medium text-primary-800 hover:text-secondary-500"
                        >
                          {item.name}
                        </Link>
                        
                        <p className="text-gray-600">${item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center">
                        <button
                          onClick={() => decreaseQuantity(item.product, item.quantity)}
                          className="px-2 py-1 bg-gray-200 text-gray-700 rounded-l-md focus:outline-none"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-center w-10">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.product, item.quantity)}
                          className="px-2 py-1 bg-gray-200 text-gray-700 rounded-r-md focus:outline-none"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="ml-4">
                        <button
                          onClick={() => removeFromCartHandler(item.product)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                          aria-label="Remove item"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold text-primary-800 mb-4">Order Summary</h2>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    $
                    {cartItems
                      .reduce((acc, item) => acc + item.price * item.quantity, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Items</span>
                  <span className="font-medium">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between mb-4">
                    <span className="text-lg font-bold text-primary-800">Total</span>
                    <span className="text-lg font-bold text-primary-800">
                      $
                      {cartItems
                        .reduce((acc, item) => acc + item.price * item.quantity, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  
                  <button
                    onClick={checkoutHandler}
                    className="w-full py-2 px-4 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50"
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;