const initialState = {
  items: [],
  loading: false,
  error: null // Use null for error state to distinguish from false
};

const itemReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_ITEMS_START':
      return {
        ...state,
        loading: true,
        error: null // Reset error state when fetching
      };

    case 'FETCH_ITEMS_SUCCESS':
      return {
        ...state,
        loading: false,
        items: action.payload
      };

    case 'FETCH_ITEMS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload // Set error message from action
      };

    case 'CLEAR_ERROR': // Action to clear error state
      return {
        ...state,
        error: null
      };

    default:
      return state; // Return the current state for any unknown actions
  }
};

export default itemReducer;
