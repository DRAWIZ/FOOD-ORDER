import axios from 'axios';
import { toast } from 'react-toastify';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL
} from '../constants/userConstants';

// Login user
export const login = (login, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.post(
      '/api/auth/login',
      { login, password },
      config
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data
    });

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
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

// Logout user
export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: USER_LOGOUT });
};

// Register user
export const register = (name, email, phone, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.post(
      '/api/auth/register',
      { name, email, phone, password },
      config
    );

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data
    });

    localStorage.setItem('userInfo', JSON.stringify(data));
    
    toast.success('Registration successful!');
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
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