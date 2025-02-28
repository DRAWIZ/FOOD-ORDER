import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../actions/cartActions';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    dispatch(addToCart(product._id, 1));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-lg font-semibold text-primary-800 hover:text-secondary-500">
            {product.name}
          </h2>
        </Link>
        
        <p className="text-sm text-gray-500 mt-1">
          {product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </p>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-primary-700">
            ${product.price.toFixed(2)}
          </span>
          
          <button
            onClick={addToCartHandler}
            className="px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;