import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  addTestimonialApi,
  fetchUserTestimonialsApi,
  fetchAllTestimonialsApi,
  deleteTestimonialApi,
} from "../../services/testimonialService";

interface Testimonial {
  id: number;
  content: string;
  name: string;
  createdAt: string;
}

interface TestimonialState {
  testimonials: Testimonial[];
  userTestimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: TestimonialState = {
  testimonials: [],
  userTestimonials: [],
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchAllTestimonials = createAsyncThunk<Testimonial[]>(
  "testimonial/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllTestimonialsApi();
    } catch (error) {
      return rejectWithValue("Error fetching testimonials");
    }
  }
);

export const fetchUserTestimonials = createAsyncThunk<Testimonial[], string>(
  "testimonial/fetchUser",
  async (token, { rejectWithValue }) => {
    try {
      return await fetchUserTestimonialsApi(token);
    } catch (error) {
      return rejectWithValue("Error fetching user testimonials");
    }
  }
);

export const addTestimonial = createAsyncThunk<
  void,
  { testimonial: string; token: string },
  { rejectValue: string }
>("testimonial/add", async ({ testimonial, token }, { rejectWithValue }) => {
  try {
    await addTestimonialApi(testimonial, token);
  } catch (error) {
    return rejectWithValue("Error adding testimonial");
  }
});

export const deleteTestimonial = createAsyncThunk<
  void,
  { testimonialId: string; token: string },
  { rejectValue: string }
>(
  "testimonial/delete",
  async ({ testimonialId, token }, { rejectWithValue }) => {
    try {
      await deleteTestimonialApi(testimonialId, token);
    } catch (error) {
      return rejectWithValue("Error deleting testimonial");
    }
  }
);

const testimonialSlice = createSlice({
  name: "testimonial",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTestimonials.fulfilled, (state, action) => {
        state.testimonials = action.payload;
      })
      .addCase(fetchUserTestimonials.fulfilled, (state, action) => {
        state.userTestimonials = action.payload;
      })
      .addCase(addTestimonial.fulfilled, (state) => {
        state.successMessage = "Testimonial added successfully!";
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.userTestimonials = state.userTestimonials.filter(
          (t) => t.id !== Number(action.meta.arg.testimonialId)
        );
        state.successMessage = "Testimonial deleted successfully!";
      });
  },
});

export const { clearMessages } = testimonialSlice.actions;

export const selectAllTestimonials = (state: RootState) =>
  state.testimonials.testimonials;
export const selectUserTestimonials = (state: RootState) =>
  state.testimonials.userTestimonials;
export const selectTestimonialLoading = (state: RootState) =>
  state.testimonials.loading;
export const selectTestimonialError = (state: RootState) =>
  state.testimonials.error;
export const selectTestimonialSuccess = (state: RootState) =>
  state.testimonials.successMessage;

export default testimonialSlice.reducer;
