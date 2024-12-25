import Cookies from 'js-cookie';
const initialState = {
  authData: null,
  loading: false,
  error: null,
  updateLoading: false
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'AUTH_START':
    case 'UPDATING_START':
      return {
        ...state,
        loading: action.type === 'AUTH_START',
        updateLoading: action.type === 'UPDATING_START',
        error: false
      };

    case 'AUTH_SUCCESS':
    case 'UPDATING_SUCCESS':
      localStorage.setItem('profile', JSON.stringify(action.data));
      return {
        ...state,
        authData: action.data,
        loading: false,
        updateLoading: false,
        error: false
      };

    case 'AUTH_FAIL':
    case 'USER_UPDATE_FAIL':
      return {
        ...state,
        loading: false,
        updateLoading: false,
        error: action.error
      };
    case 'USER_DELETION_FAIL':
      return {
        ...state,
        loading: false,
        updateLoading: false,
        error: action.error
      };
    case 'USER_DELETION_START':
      localStorage.clear();
      Cookies.remove('token');
      return {
        ...initialState
      };
    case 'USER_DELETION_SUCCESS':
      return {
        ...state,
        loading: true,
        error: false
      };

    case 'LOG_OUT':
      localStorage.clear();
      Cookies.remove('token');
      Cookies.remove('token', { path: '/', domain: 'localhost' });

      return { ...initialState };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: false
      };

    case 'USERDATA_UPDATE_START':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'USER_FOLLOW_SUCCESS':
      // Update the followingRequests list
      localStorage.setItem('profile', JSON.stringify(action.payload));

      return {
        ...state,
        loading: false,
        authData: {
          ...state.authData,
          user: action.payload
        },
        error: null
      };

    case 'USER_UNFOLLOW_SUCCESS':
      // Update the followingRequests list
      return {
        ...state,
        loading: false,
        authData: {
          ...state.authData,
          user: {
            ...state.authData.user,
            sentFriendRequests: action.payload.sentFriendRequests
          }
        },
        error: null
      };

    case 'USERDATA_UPDATE_FAIL':
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default authReducer;
