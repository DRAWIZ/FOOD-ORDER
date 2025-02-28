import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';

const HomeScreen = () => {
  const dispatch = useDispatch();
  
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  
  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);
  
  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});
  
  return (
    <div>
      <div className="bg-primary-800 text-white py-12 px-4 mb-8 rounded-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Delicious Food, Delivered To Your Door
          </h1>
          <p className="text-lg">
            Browse our menu and order your favorite dishes with our easy token system.
            Quick, easy, and contactless!
          </p>
        </div>
      </div>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : products.length === 0 ? (
        <Message>No products available</Message>
      ) : (
        <>
          {Object.keys(groupedProducts).map((category) => (
            <div key={category} className="mb-10">
              <h2 className="text-2xl font-bold text-primary-800 mb-6 pb-2 border-b border-gray-200">
                {category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedProducts[category].map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default HomeScreen;