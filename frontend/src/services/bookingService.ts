import {
  BOOKING_URL,
  BOOKING_API_URL,
  BOOKING_MY_URL,
} from "../config/apiConfig";
import { Booking } from "../redux/slices/bookingSlice";

// Функция для получения доступных временных слотов
export const fetchAvailableSlotsApi = async (
  date: string
): Promise<string[]> => {
  const response = await fetch(
    `${BOOKING_API_URL}available-slots?date=${date}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch available slots");
  }
  return await response.json();
};

// Функция для создания нового бронирования (с опциональным токеном авторизации)
export const createBookingApi = async (
  bookingData: {
    name: string;
    email: string;
    phone: string;
    service?: string;
    date: string;
    time: string;
  },
  token?: string
): Promise<void> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Добавляем токен авторизации, если пользователь зарегистрирован и токен передан
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(BOOKING_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) {
    throw new Error("Failed to create booking");
  }
};

// Функция для получения всех бронирований текущего пользователя
export const fetchUserBookingsApi = async (token: string): Promise<any> => {
  const response = await fetch(BOOKING_MY_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Токен обязателен для зарегистрированного пользователя
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user bookings");
  }
  return await response.json();
};
export const fetchAllBookingsApi = async (
  token: string
): Promise<Booking[]> => {
  const response = await fetch(BOOKING_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Токен обязателен для администратора
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch all bookings");
  }
  return await response.json();
};
