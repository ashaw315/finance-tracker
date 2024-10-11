import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import financeReducer from './slices/financeSlice';

const rootReducer = combineReducers({
  plaid: financeReducer,
  auth: authReducer,
});

export default rootReducer;
