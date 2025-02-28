import axios from 'axios';
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_CLEAR_ITEMS } from '../constants/cartConstants';

// Add item to cart
export const addToCart = (id, quantity = 1) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      quantity
    }
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// Remove item from cart
export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// Clear cart
export const clearCart = () => (dispatch) => {
  dispatch({ type: CART_CLEAR_ITEMS });
  localStorage.removeItem('cartItems');
};