// import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import thunk from "redux-thunk";
// import authReducer from "./slices/authSlice";

// // Комбинирование всех редьюсеров в один корневой
// const rootReducer = combineReducers({
//   auth: authReducer,
// });

// // Конфигурация persist для сохранения состояния в локальном хранилище
// const persistConfig = {
//   key: "root",
//   storage,
// };

// // Создание persist reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Конфигурация store
// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: [thunk],
//   devTools: process.env.NODE_ENV !== "production",
// });

// // Экспорт persistor для использования в корневом компоненте
// export const persistor = persistStore(store);

// // Типы для использования в селекторах
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
import { configureStore } from "@reduxjs/toolkit";
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
};

// Создание persist reducer для auth
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Конфигурация store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
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
