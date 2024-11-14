import { configureStore } from "@reduxjs/toolkit";
import documentReducer from "./slices/documentSlice";
import testimonialReducer from "./slices/testimonialSlice";
import bookingReducer from "./slices/bookingSlice";
import authReducer, { initializeAuthState } from "./slices/authSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    documents: documentReducer,
    testimonials: testimonialReducer,
    booking: bookingReducer,
    document: documentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});
export const persistor = persistStore(store);

persistor.subscribe(() => {
  if (persistor.getState().bootstrapped) {
    store.dispatch(initializeAuthState());
  }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
