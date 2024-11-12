// frontend/src/config/apiConfig.ts

// Базовый адрес сервера, где работает ваш бекенд
const BASE_URL = "https://tax-consulting-app.onrender.com";

// URL для различных модулей вашего API
export const AUTH_API_URL = `${BASE_URL}/auth/`;
export const TESTIMONIALS_API_URL = `${BASE_URL}/api/testimonials/`;
export const DOCUMENTS_API_URL = `${BASE_URL}/api/documents/`;
export const BOOKING_API_URL = `${BASE_URL}/api/booking/`;
export const USERS_API_URL = `${BASE_URL}/api/user/`;

// Эндпоинты для авторизации
export const AUTH_LOGIN_URL = `${AUTH_API_URL}login`;
export const AUTH_LOGOUT_URL = `${AUTH_API_URL}logout`;
export const AUTH_REGISTER_URL = `${AUTH_API_URL}register`;
export const AUTH_ME_URL = `${AUTH_API_URL}me`;

// Эндпоинты для отзывов (доступны для всех пользователей)
export const TESTIMONIALS_URL = `${TESTIMONIALS_API_URL}`;

// Эндпоинты для документов (защищенные маршруты)
// Эти эндпоинты доступны для пользователя (для просмотра своих документов) и для администратора (для всех документов)
export const DOCUMENTS_URL = `${DOCUMENTS_API_URL}`; // Получить все документы (для администратора) или доступ к документам пользователя
export const DOCUMENTS_ID_URL = (id: string) => `${DOCUMENTS_API_URL}${id}`; // Доступ к конкретному документу по ID
export const DOCUMENTS_MY_URL = `${DOCUMENTS_API_URL}my`; // Доступ к документам текущего пользователя
export const TESTIMONIALS_ID_URL = (id: string) =>
  `${TESTIMONIALS_API_URL}${id}`;
export const TESTIMONIALS_MY_URL = `${TESTIMONIALS_API_URL}my`;

// Эндпоинты для бронирования встреч (доступны для всех, включая незарегистрированных пользователей)
export const BOOKING_URL = `${BOOKING_API_URL}`;
// Эндпоинты для букинга (защищенные маршруты)
export const BOOKING_ID_URL = (id: string) => `${BOOKING_API_URL}${id}`;
export const BOOKING_MY_URL = `${BOOKING_API_URL}my`;

// Эндпоинты для пользователей (доступны только для администратора)
export const USERS_URL = `${USERS_API_URL}`; // Получить всех пользователей
export const USERS_ID_URL = (id: string) => `${USERS_API_URL}${id}`; // Доступ к конкретному пользователю по ID
