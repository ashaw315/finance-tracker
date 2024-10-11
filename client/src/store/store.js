import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,    // Root reducer with all slices
  devTools: process.env.NODE_ENV !== 'production', // Enable DevTools in dev mode
});

export default store;
