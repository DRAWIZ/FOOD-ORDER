import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../actions/userActions';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  return (
    <header className="bg-primary-800 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            Food Ordering
          </Link>
          
          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="block md:hidden focus:outline-none"
            aria-label="Menu"
          >
            <svg
              className="h-6 w-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                />
              )}
            </svg>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/token-lookup" className="hover:text-secondary-300">
              Track Order
            </Link>
            
            <Link to="/cart" className="flex items-center hover:text-secondary-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Cart
              {cartItems.length > 0 && (
                <span className="ml-1 bg-secondary-500 rounded-full px-2 text-xs">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>
            
            {userInfo ? (
              <div className="relative group">
                <button className="flex items-center hover:text-secondary-300 focus:outline-none">
                  {userInfo.name}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  
                  {userInfo.role === 'admin' && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/admin/products"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Products
                      </Link>
                      <Link
                        to="/admin/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                    </>
                  )}
                  
                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hover:text-secondary-300">
                Sign In
              </Link>
            )}
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="mt-4 md:hidden">
            <Link
              to="/token-lookup"
              className="block py-2 hover:text-secondary-300"
              onClick={toggleMenu}
            >
              Track Order
            </Link>
            
            <Link
              to="/cart"
              className="flex items-center py-2 hover:text-secondary-300"
              onClick={toggleMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Cart
              {cartItems.length > 0 && (
                <span className="ml-1 bg-secondary-500 rounded-full px-2 text-xs">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>
            
            {userInfo ? (
              <>
                <Link
                  to="/profile"
                  className="block py-2 hover:text-secondary-300"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                
                {userInfo.role === 'admin' && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="block py-2 hover:text-secondary-300"
                      onClick={toggleMenu}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/products"
                      className="block py-2 hover:text-secondary-300"
                      onClick={toggleMenu}
                    >
                      Products
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="block py-2 hover:text-secondary-300"
                      onClick={toggleMenu}
                    >
                      Orders
                    </Link>
                  </>
                )}
                
                <button
                  onClick={() => {
                    logoutHandler();
                    toggleMenu();
                  }}
                  className="block w-full text-left py-2 hover:text-secondary-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-2 hover:text-secondary-300"
                onClick={toggleMenu}
              >
                Sign In
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;