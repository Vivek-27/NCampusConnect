import * as AuthApi from '../api/AuthRequest';

export const logIn = (formData, navigate) => async (dispatch) => {
  dispatch({ type: 'AUTH_START' });
  try {
    const { data } = await AuthApi.logIn(formData);
    dispatch({ type: 'AUTH_SUCCESS', data: data });
    navigate('/');
  } catch (error) {
    dispatch({ type: 'AUTH_FAIL', error: error.response.data });
  }
};

export const register = (formData, navigate) => async (dispatch) => {
  dispatch({ type: 'AUTH_START' });
  try {
    const { data } = await AuthApi.signUp(formData);
    dispatch({ type: 'AUTH_SUCCESS', data: data });
    navigate('/');
  } catch (error) {
    console.log(error);
    dispatch({ type: 'AUTH_FAIL' });
  }
};

export const logout = () => async (dispatch) => {
  dispatch({ type: 'LOG_OUT' });
};

export const clearError = () => async (dispatch) => {
  dispatch({ type: 'CLEAR_ERROR' });
};
