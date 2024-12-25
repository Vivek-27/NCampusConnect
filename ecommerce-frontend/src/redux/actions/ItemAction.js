import * as ItemApi from '../api/ItemRequest';

// // Action creator to fetch items
// export const fetchItems = () => async (dispatch) => {
//   dispatch({ type: 'FETCH_ITEMS_START' });
//   try {
//     const { data } = await ItemApi.fetchItems();
//     dispatch({ type: 'FETCH_ITEMS_SUCCESS', payload: data });
//   } catch (error) {
//     dispatch({ type: 'FETCH_ITEMS_FAIL', payload: error.response.data });
//   }
// };

// Action creator to fetch filtered items
export const fetchItems = (filters) => async (dispatch) => {
  dispatch({ type: 'FETCH_ITEMS_START' });
  try {
    // Construct the query parameters from the filters
    const params = new URLSearchParams();

    if (filters.categories && filters.categories.length > 0) {
      filters.categories.forEach((category) =>
        params.append('category', category)
      );
    }

    if (filters.priceRange && filters.priceRange.length === 2) {
      params.append('minPrice', filters.priceRange[0]);
      params.append('maxPrice', filters.priceRange[1]);
    }

    // Make the API request with the filter parameters
    const { data } = await ItemApi.fetchItems(params); // Assuming your API accepts query params

    dispatch({ type: 'FETCH_ITEMS_SUCCESS', payload: data });
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data
      : error.message || 'Something went wrong. Please try again later.';

    dispatch({
      type: 'FETCH_ITEMS_FAIL',
      payload: errorMessage
    });
  }
};

// Action creator to clear error state
export const clearError = () => (dispatch) => {
  dispatch({ type: 'CLEAR_ERROR' });
};
