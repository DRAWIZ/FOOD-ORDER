import axios from 'axios';
import { toast } from 'react-toastify';
import { CART_CLEAR_ITEMS } from '../constants/cartConstants';
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_STATUS_UPDATE_REQUEST,
  ORDER_STATUS_UPDATE_SUCCESS,
  ORDER_STATUS_UPDATE_FAIL,
  USER_ORDERS_REQUEST,
  USER_ORDERS_SUCCESS,
  USER_ORDERS_FAIL
} from '../constants/orderConstants';

// Create new order
export const createOrder = (orderItems) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });

    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    const { data } = await axios.post('/api/orders', { orderItems }, config);

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data
    });

    // Clear cart after successful order
    dispatch({ type: CART_CLEAR_ITEMS });
    localStorage.removeItem('cartItems');
    
    toast.success('Order placed successfully!');
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
    
    toast.error(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    );
  }
};

// Get order details
export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });

    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    const { data } = await axios.get(`/api/orders/${id}`, config);

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
    
    toast.error(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    );
  }
};

// Get all orders (admin)
export const listOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_LIST_REQUEST });

    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    const { data } = await axios.get('/api/orders', config);

    dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: ORDER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
    
    toast.error(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    );
  }
};

// Update order status
export const updateOrderStatus = (id, status) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_STATUS_UPDATE_REQUEST });

    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    const { data } = await axios.put(`/api/orders/${id}/status`, { status }, config);

    dispatch({
      type: ORDER_STATUS_UPDATE_SUCCESS,
      payload: data
    });
    
    toast.success(`Order status updated to ${status}`);
  } catch (error) {
    dispatch({
      type: ORDER_STATUS_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
    
    toast.error(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    );
  }
};

// Get user orders
export const getUserOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_ORDERS_REQUEST });

    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    const { data } = await axios.get('/api/orders/myorders', config);

    dispatch({
      type: USER_ORDERS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: USER_ORDERS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
    
    toast.error(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    );
  }
};

// Get order by token
export const getOrderByToken = (token) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/orders/token/${token}`);

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
    
    toast.error(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    );
  }
};