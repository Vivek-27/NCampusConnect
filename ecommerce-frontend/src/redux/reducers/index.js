import { combineReducers } from 'redux';

import authReducer from './AuthReducer';
import cartReducer from './cartReducer';
import itemReducer from './itemReducer';
import myItemsReducer from './myItemsReducer';
export const reducers = combineReducers({
  authReducer,
  cartReducer,
  myItemsReducer,
  itemReducer
});
