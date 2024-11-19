import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  fetchAvailableSlotsApi,
  createBookingApi,
  fetchUserBookingsApi,
  fetchAllBookingsApi,
  deleteBookingApi,
} from "../../services/bookingService";

// Интерфейсы для данных бронирования
export interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  service?: string;
  date: string;
  time: string;
}

interface BookingState {
  availableSlots: string[];
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: BookingState = {
  availableSlots: [],
  bookings: [],
  loading: false,
  error: null,
  successMessage: null,
};

// Асинхронный thunk для получения доступных временных слотов
export const fetchAvailableSlots = createAsyncThunk<string[], string>(
  "booking/fetchAvailableSlots",
  async (date, { rejectWithValue }) => {
    try {
      return await fetchAvailableSlotsApi(date);
    } catch (error) {
      return rejectWithValue("Error fetching available slots");
    }
  }
);

// Асинхронный thunk для создания бронирования (для зарегистрированного и незарегистрированного пользователя)
export const createBooking = createAsyncThunk<
  void,
  {
    name: string;
    email: string;
    phone: string;
    service?: string;
    date: string;
    time: string;
    token?: string;
  }
>("booking/createBooking", async (bookingData, { rejectWithValue }) => {
  try {
    const { token, ...data } = bookingData; // Извлекаем токен из данных бронирования
    await createBookingApi(data, token); // Передаем токен, если он есть
  } catch (error) {
    return rejectWithValue("Error creating booking");
  }
});

// Асинхронный thunk для получения всех бронирований текущего пользователя
export const fetchUserBookings = createAsyncThunk<Booking[], string>(
  "booking/fetchUserBookings",
  async (token, { rejectWithValue }) => {
    try {
      return await fetchUserBookingsApi(token);
    } catch (error) {
      return rejectWithValue("Error fetching user bookings");
    }
  }
);
export const fetchAllBookings = createAsyncThunk<Booking[], string>(
  "booking/fetchAllBookings",
  async (token, { rejectWithValue }) => {
    try {
      const bookings = await fetchAllBookingsApi(token);
      console.log("Fetched bookings:", bookings);
      return bookings;
    } catch (error) {
      return rejectWithValue("Error fetching all bookings");
    }
  }
);
// Добавьте новый thunk для удаления бронирования
export const deleteBooking = createAsyncThunk<
  void,
  { bookingId: number; token: string }
>(
  "booking/deleteBooking",
  async ({ bookingId, token }, { rejectWithValue }) => {
    try {
      await deleteBookingApi(bookingId, token);
    } catch (error) {
      return rejectWithValue("Error deleting booking");
    }
  }
);

// Slice для бронирования
const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка получения доступных временных слотов
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAvailableSlots.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.loading = false;
          state.availableSlots = action.payload;
        }
      )
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Обработка создания бронирования
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Booking successfully created";
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Обработка получения всех бронирований текущего пользователя
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserBookings.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          state.loading = false;
          state.bookings = action.payload;
        }
      )
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllBookings.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          state.loading = false;
          state.bookings = action.payload;
        }
      )
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter(
          (booking) => booking.id !== action.meta.arg.bookingId
        );
        state.successMessage = "Booking successfully deleted";
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = bookingSlice.actions;

// Селекторы для получения данных из состояния бронирования
export const selectAvailableSlots = (state: RootState) =>
  state.booking.availableSlots;
export const selectUserBookings = (state: RootState) => state.booking.bookings;
export const selectBookingLoading = (state: RootState) => state.booking.loading;
export const selectBookingError = (state: RootState) => state.booking.error;
export const selectBookingSuccess = (state: RootState) =>
  state.booking.successMessage;

export default bookingSlice.reducer;
