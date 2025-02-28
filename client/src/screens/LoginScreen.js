import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../actions/userActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const LoginScreen = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  
  const redirect = location.search ? location.search.split('=')[1] : '/';
  
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);
  
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(loginId, password));
  };
  
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-primary-800 mb-6">Sign In</h1>
      
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label
            htmlFor="loginId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email or Phone
          </label>
          <input
            type="text"
            id="loginId"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
            placeholder="Enter email or phone"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50"
        >
          Sign In
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          New customer?{' '}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            className="text-secondary-500 hover:text-secondary-600"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;