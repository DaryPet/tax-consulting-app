const BASE_URL = "https://tax-consulting-app.onrender.com";

export const AUTH_API_URL = `${BASE_URL}/auth/`;
export const TESTIMONIALS_API_URL = `${BASE_URL}/testimonial/`;
export const DOCUMENTS_API_URL = `${BASE_URL}/documents/`;
export const BOOKING_API_URL = `${BASE_URL}/booking/`;
export const USERS_API_URL = `${BASE_URL}/users/`;

export const AUTH_LOGIN_URL = `${AUTH_API_URL}login`;
export const AUTH_LOGOUT_URL = `${AUTH_API_URL}logout`;
export const AUTH_REGISTER_URL = `${AUTH_API_URL}register`;
export const AUTH_REFRESH_URL = `${AUTH_API_URL}refresh`;
export const AUTH_ME_URL = `${AUTH_API_URL}me`;

export const TESTIMONIALS_URL = `${TESTIMONIALS_API_URL}`;

export const DOCUMENTS_URL = `${DOCUMENTS_API_URL}`;
export const DOCUMENTS_ID_URL = (id: string) => `${DOCUMENTS_API_URL}${id}`;
export const DOCUMENTS_MY_URL = `${DOCUMENTS_API_URL}my`;
export const TESTIMONIALS_ID_URL = (id: string) =>
  `${TESTIMONIALS_API_URL}${id}`;
export const TESTIMONIALS_MY_URL = `${TESTIMONIALS_API_URL}my`;

export const BOOKING_URL = `${BOOKING_API_URL}`;
export const BOOKING_ID_URL = (id: string) => `${BOOKING_API_URL}${id}`;
export const BOOKING_MY_URL = `${BOOKING_API_URL}my`;

export const USERS_URL = `${USERS_API_URL}`;
export const USERS_ID_URL = (id: string) => `${USERS_API_URL}/${id}`;
