import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import OrderScreen from './screens/OrderScreen';
import OrderSuccessScreen from './screens/OrderSuccessScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AdminProductsScreen from './screens/AdminProductsScreen';
import AdminOrdersScreen from './screens/AdminOrdersScreen';
import AdminProductEditScreen from './screens/AdminProductEditScreen';
import AdminOrderDetailsScreen from './screens/AdminOrderDetailsScreen';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import TokenLookupScreen from './screens/TokenLookupScreen';

const App = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen py-3">
        <div className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/order/success/:id" element={<OrderSuccessScreen />} />
            <Route path="/token-lookup" element={<TokenLookupScreen />} />
            
            <Route path="/profile" element={
              <PrivateRoute>
                <ProfileScreen />
              </PrivateRoute>
            } />
            
            <Route path="/order/:id" element={
              <PrivateRoute>
                <OrderScreen />
              </PrivateRoute>
            } />
            
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboardScreen />
              </AdminRoute>
            } />
            
            <Route path="/admin/products" element={
              <AdminRoute>
                <AdminProductsScreen />
              </AdminRoute>
            } />
            
            <Route path="/admin/product/:id/edit" element={
              <AdminRoute>
                <AdminProductEditScreen />
              </AdminRoute>
            } />
            
            <Route path="/admin/orders" element={
              <AdminRoute>
                <AdminOrdersScreen />
              </AdminRoute>
            } />
            
            <Route path="/admin/order/:id" element={
              <AdminRoute>
                <AdminOrderDetailsScreen />
              </AdminRoute>
            } />
          </Routes>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default App;