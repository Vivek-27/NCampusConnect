import * as UserAPI from '../api/UserRequest';

export const updateUser = (formData) => async (dispatch) => {
  dispatch({ type: 'UPDATING_START' });
  try {
    const { data } = await UserAPI.updateUser(formData);
    dispatch({ type: 'UPDATING_SUCCESS', data: data });
  } catch (error) {
    console.log(error.response);
    dispatch({ type: 'USER_UPDATE_FAIL', error: error.response.data });
  }
};

export const deleteUser = () => async (dispatch) => {
  dispatch({ type: 'USER_DELETION_START' });
  try {
    await UserAPI.deleteUser();
    dispatch({ type: 'USER_DELETION_SUCCESS' });
  } catch (error) {
    dispatch({ type: 'USER_DELETION_FAIL', error: error.response.data });
  }
};

// Redux Action: followUser
export const updatedUserDetails = () => async (dispatch) => {
  dispatch({ type: 'USERDATA_UPDATE_START' });

  try {
    const response = await UserAPI.updatedUserDetails(); // API call
    const updatedUser = response.data; // Get updated user data from backend response

    dispatch({
      type: 'USER_FOLLOW_SUCCESS',
      payload: updatedUser // Dispatch the updated data to Redux store
    });
    console.log(updatedUser);
  } catch (error) {
    dispatch({
      type: 'USERDATA_UPDATE_FAIL',
      error: error.response?.data?.message || 'An error occurred.'
    });
  }
};

// Redux Action: followUser
export const followUser = (id) => async (dispatch) => {
  dispatch({ type: 'USERDATA_UPDATE_START' });

  try {
    const response = await UserAPI.followUser({ selectedUserId: id }); // API call
    const updatedUser = response.data; // Get updated user data from backend response

    dispatch({
      type: 'USER_FOLLOW_SUCCESS',
      payload: updatedUser // Dispatch the updated data to Redux store
    });
  } catch (error) {
    dispatch({
      type: 'USERDATA_UPDATE_FAIL',
      error: error.response?.data?.message || 'An error occurred.'
    });
  }
};

// Redux Action: acceptReq
export const acceptFollowRequest = (id) => async (dispatch) => {
  dispatch({ type: 'USERDATA_UPDATE_START' });

  try {
    const response = await UserAPI.acceptRequest({ selectedUserId: id }); // API call
    const updatedUser = response.data; // Get updated user data from backend response

    dispatch({
      type: 'USER_FOLLOW_SUCCESS',
      payload: updatedUser // Dispatch the updated data to Redux store
    });
    console.log(updatedUser);
  } catch (error) {
    dispatch({
      type: 'USERDATA_UPDATE_FAIL',
      error: error.response?.data?.message || 'An error occurred.'
    });
  }
};
export const denyFollowRequest = (id) => async (dispatch) => {
  dispatch({ type: 'USERDATA_UPDATE_START' });

  try {
    const response = await UserAPI.denyReq({ selectedUserId: id }); // API call
    const updatedUser = response.data; // Get updated user data from backend response

    dispatch({
      type: 'USER_FOLLOW_SUCCESS',
      payload: updatedUser // Dispatch the updated data to Redux store
    });
    console.log(updatedUser);
  } catch (error) {
    dispatch({
      type: 'USERDATA_UPDATE_FAIL',
      error: error.response?.data?.message || 'An error occurred.'
    });
  }
};

export const withdrawFollowUser = (id) => async (dispatch) => {
  dispatch({ type: 'USERDATA_UPDATE_START' });

  try {
    const response = await UserAPI.withdrawfollow({ selectedUserId: id }); // API call
    const updatedUser = response.data; // Get updated user data from backend response

    dispatch({
      type: 'USER_FOLLOW_SUCCESS',
      payload: updatedUser // Dispatch the updated data to Redux store
    });
  } catch (error) {
    dispatch({
      type: 'USERDATA_UPDATE_FAIL',
      error: error.response?.data?.message || 'An error occurred.'
    });
  }
};
