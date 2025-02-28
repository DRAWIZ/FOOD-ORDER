import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails } from '../actions/productActions';
import { addToCart } from '../actions/cartActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductScreen = () => {
  const [quantity, setQuantity] = useState(1);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  
  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [dispatch, id]);
  
  const increaseQuantity = () => {
    setQuantity((prevQty) => prevQty + 1);
  };
  
  const decreaseQuantity = () => {
    setQuantity((prevQty) => (prevQty > 1 ? prevQty - 1 : 1));
  };
  
  const addToCartHandler = () => {
    dispatch(addToCart(id, quantity));
    navigate('/cart');
  };
  
  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center text-primary-700 hover:text-secondary-500 mb-4"
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Menu
      </Link>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : Object.keys(product).length === 0 ? (
        <Message>Product not found</Message>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 md:h-auto object-cover"
              />
            </div>
            
            <div className="p-6 md:w-1/2">
              <h1 className="text-2xl font-bold text-primary-800 mb-4">{product.name}</h1>
              
              <div className="mb-4">
                <span className="text-2xl font-bold text-primary-700">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              {product.isAvailable ? (
                <>
                  <div className="mb-6">
                    <div className="flex items-center">
                      <button
                        onClick={decreaseQuantity}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-l-md focus:outline-none"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-gray-100 text-gray-700 text-center w-12">
                        {quantity}
                      </span>
                      <button
                        onClick={increaseQuantity}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-r-md focus:outline-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={addToCartHandler}
                    className="w-full py-2 px-4 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50"
                  >
                    Add to Cart
                  </button>
                </>
              ) : (
                <div className="mb-4">
                  <Message variant="danger">Currently not available</Message>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductScreen;