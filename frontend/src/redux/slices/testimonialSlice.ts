import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  content: string;
  createdAt: string;
}

interface TestimonialState {
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
}

const initialState: TestimonialState = {
  testimonials: [],
  loading: false,
  error: null,
};

// Асинхронное действие для получения отзывов с API
export const fetchTestimonials = createAsyncThunk(
  "testimonials/fetchTestimonials",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Testimonial[]>("/api/testimonial"); // Убедитесь, что базовый URL настроен в axios
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const testimonialSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = action.payload;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default testimonialSlice.reducer;
