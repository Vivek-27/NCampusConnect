import * as ItemApi from '../api/ItemRequest';

export const fetch_myItems = () => async (dispatch) => {
  dispatch({ type: 'FETCH_MY_ITEMS_START' });
  try {
    const { data } = await ItemApi.fetchMyItems();
    console.log(data);
    dispatch({ type: 'FETCH_MY_ITEMS_SUCCESS', payload: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: 'FETCH_MY_ITEMS_FAIL', payload: error.response.data });
  }
};

// Action creator to add a new item
export const addItem = (itemData) => async (dispatch) => {
  dispatch({ type: 'ADD_ITEM_START' });
  try {
    const { data } = await ItemApi.addItem(itemData);
    dispatch({ type: 'ADD_ITEM_SUCCESS', payload: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: 'ADD_ITEM_FAIL', payload: error.response.data });
  }
};

// Action creator to update an existing item
export const updateItem = (itemId, updatedData) => async (dispatch) => {
  dispatch({ type: 'UPDATE_ITEM_START' });
  try {
    const { data } = await ItemApi.updateItem(itemId, updatedData); // API call to update the item
    dispatch({ type: 'UPDATE_ITEM_SUCCESS', payload: data }); // Dispatch the updated item data
  } catch (error) {
    dispatch({ type: 'UPDATE_ITEM_FAIL', payload: error.response.data }); // Dispatch failure action
  }
};

// Action creator to delete an item
export const deleteItem = (itemId) => async (dispatch) => {
  dispatch({ type: 'DELETE_ITEM_START' });
  try {
    await ItemApi.deleteItem(itemId); // API call to delete the item
    dispatch({ type: 'DELETE_ITEM_SUCCESS', payload: itemId }); // Dispatch success action with the itemId
  } catch (error) {
    dispatch({ type: 'DELETE_ITEM_FAIL', payload: error.response.data }); // Dispatch failure action
  }
};
