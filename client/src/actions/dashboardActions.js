import axios from 'axios';
import { toast } from 'react-toastify';
import {
  DASHBOARD_STATS_REQUEST,
  DASHBOARD_STATS_SUCCESS,
  DASHBOARD_STATS_FAIL
} from '../constants/dashboardConstants';

// Get dashboard statistics
export const getDashboardStats = () => async (dispatch, getState) => {
  try {
    dispatch({ type: DASHBOARD_STATS_REQUEST });

    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    const { data } = await axios.get('/api/dashboard', config);

    dispatch({
      type: DASHBOARD_STATS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: DASHBOARD_STATS_FAIL,
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