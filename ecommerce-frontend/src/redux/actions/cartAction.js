export const addItemToCart = (item) => (dispatch) => {
  dispatch({ type: 'CART_LOADING_START' });
  try {
    dispatch({ type: 'CART_ADD_ITEM', payload: item }); // Directly add the item to the cart
    dispatch({ type: 'CART_LOADING_END' });
  } catch (error) {
    dispatch({ type: 'CART_ERROR', error: 'Failed to add item to cart.' });
  }
};

export const removeItemFromCart = (id) => (dispatch) => {
  dispatch({ type: 'CART_LOADING_START' });
  try {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: { id } }); // Directly remove the item from the cart
    dispatch({ type: 'CART_LOADING_END' });
  } catch (error) {
    dispatch({ type: 'CART_ERROR', error: 'Failed to remove item from cart.' });
  }
};

export const updateCartItem = (item) => (dispatch) => {
  dispatch({ type: 'CART_LOADING_START' });
  try {
    dispatch({ type: 'CART_UPDATE_ITEM', payload: item }); // Directly update the item in the cart
    dispatch({ type: 'CART_LOADING_END' });
  } catch (error) {
    dispatch({ type: 'CART_ERROR', error: 'Failed to update item in cart.' });
  }
};

export const clearCart = () => (dispatch) => {
  dispatch({ type: 'CART_CLEAR' }); // Clear cart in state
};

export const clearCartError = () => (dispatch) => {
  dispatch({ type: 'CLEAR_ERROR' });
};
