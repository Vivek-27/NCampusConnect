const initialState = {
  items: [],
  loading: false,
  error: null
};

const myItemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_MY_ITEMS_START':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'FETCH_MY_ITEMS_SUCCESS':
      return {
        ...state,
        loading: false,
        items: action.payload
      };
    case 'FETCH_MY_ITEMS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case 'ADD_ITEM_START':
      return {
        ...state,
        loading: true,
        error: null // Reset error state on new addition
      };

    case 'ADD_ITEM_SUCCESS':
      return {
        ...state,
        loading: false,
        items: [...state.items, action.payload] // Add the new item
      };

    case 'ADD_ITEM_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload // Set error message from action
      };

    case 'DELETE_ITEM_START':
      return {
        ...state,
        loading: true,
        error: null // Reset error state on deletion
      };

    case 'DELETE_ITEM_SUCCESS':
      return {
        ...state,
        loading: false,
        items: state.items.filter((item) => item.id !== action.payload) // Remove the item
      };

    case 'DELETE_ITEM_FAIL':
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
      return state;
  }
};

export default myItemsReducer;
