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
    ORDER_STATUS_UPDATE_RESET,
    USER_ORDERS_REQUEST,
    USER_ORDERS_SUCCESS,
    USER_ORDERS_FAIL
  } from '../constants/orderConstants';
  
  export const orderCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case ORDER_CREATE_REQUEST:
        return { loading: true };
      case ORDER_CREATE_SUCCESS:
        return { loading: false, success: true, order: action.payload };
      case ORDER_CREATE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const orderDetailsReducer = (state = { order: {} }, action) => {
    switch (action.type) {
      case ORDER_DETAILS_REQUEST:
        return { ...state, loading: true };
      case ORDER_DETAILS_SUCCESS:
        return { loading: false, order: action.payload };
      case ORDER_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const orderListReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
      case ORDER_LIST_REQUEST:
        return { loading: true };
      case ORDER_LIST_SUCCESS:
        return { loading: false, orders: action.payload };
      case ORDER_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const orderStatusUpdateReducer = (state = {}, action) => {
    switch (action.type) {
      case ORDER_STATUS_UPDATE_REQUEST:
        return { loading: true };
      case ORDER_STATUS_UPDATE_SUCCESS:
        return { loading: false, success: true };
      case ORDER_STATUS_UPDATE_FAIL:
        return { loading: false, error: action.payload };
      case ORDER_STATUS_UPDATE_RESET:
        return {};
      default:
        return state;
    }
  };
  
  export const userOrdersReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
      case USER_ORDERS_REQUEST:
        return { loading: true };
      case USER_ORDERS_SUCCESS:
        return { loading: false, orders: action.payload };
      case USER_ORDERS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };