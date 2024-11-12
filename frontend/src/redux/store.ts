import { configureStore } from "@reduxjs/toolkit";
import documentReducer from "./slices/documentSlice";
import authReducer from "./slices/authSlice";
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
  whitelist: ["token"],
};

// Создание persist reducer для auth
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Конфигурация store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    documents: documentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Экспорт persistor для использования в корневом компоненте
export const persistor = persistStore(store);

// Типы для использования в селекторах
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
