import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import favouritesReducer from './favourites';

// Configuration for redux-persist
const persistConfig = {
  key: 'root', // Key for storing the data
  storage,
};

const persistedReducer = persistReducer(persistConfig, favouritesReducer);

const store = configureStore({
  reducer: {
    favourites: persistedReducer,
  },
});

export const persistor = persistStore(store);
export default store;
