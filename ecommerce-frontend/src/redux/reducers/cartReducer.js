const initialState = {
  items: [], // Store the items in the cart
  loading: false,
  error: null
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM': // Action to add an item to the cart
      return {
        ...state,
        items: [...state.items, action.payload] // Add item to the cart
      };

    case 'CART_REMOVE_ITEM': // Action to remove an item from the cart
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload.id) // Remove item by ID
      };

    case 'CART_UPDATE_ITEM': // Action to update an item in the cart
      return {
        ...state,
        items: state.items.map((item) =>
          item._id === action.payload._id
            ? { ...item, ...action.payload }
            : item
        )
      };

    case 'CART_LOADING_START': // Action to start loading
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'CART_LOADING_END': // Action to end loading
      return {
        ...state,
        loading: false
      };

    case 'CART_ERROR': // Action to handle errors
      return {
        ...state,
        loading: false,
        error: action.error
      };

    case 'CLEAR_ERROR': // Action to clear errors
      return {
        ...state,
        error: null
      };

    case 'CART_CLEAR': // Action to clear the cart
      return {
        ...initialState // Reset to initial state
      };

    default:
      return state; // Return the current state if no action matches
  }
};

export default cartReducer;
