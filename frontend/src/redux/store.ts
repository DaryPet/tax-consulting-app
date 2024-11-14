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

// Конфигурация persist для auth
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user"],
};

// Создание persist reducer для auth
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Конфигурация store
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
    // Если состояние уже восстановлено, инициализируем состояние авторизации
    store.dispatch(initializeAuthState());
  }
});
// Экспорт persistor для использования в корневом компоненте

// Типы для использования в селекторах
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
