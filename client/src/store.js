import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { 
  userLoginReducer, 
  userRegisterReducer 
} from './reducers/userReducers';

import {
  productListReducer,
  productDetailsReducer,
  productCreateReducer,
  productUpdateReducer,
  productDeleteReducer,
  productUploadReducer
} from './reducers/productReducers';

import {
  orderCreateReducer,
  orderDetailsReducer,
  orderListReducer,
  orderStatusUpdateReducer,
  userOrdersReducer
} from './reducers/orderReducers';

import {
  cartReducer
} from './reducers/cartReducers';

import {
  dashboardStatsReducer
} from './reducers/dashboardReducers';

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productDelete: productDeleteReducer,
  productUpload: productUploadReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderList: orderListReducer,
  orderStatusUpdate: orderStatusUpdateReducer,
  userOrders: userOrdersReducer,
  cart: cartReducer,
  dashboardStats: dashboardStatsReducer
});

// Get user info from localStorage
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

// Get cart items from localStorage
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
  cart: { cartItems: cartItemsFromStorage }
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;