
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface FiltersState {
  name: string;
  currentPage: number;
}

const initialState: FiltersState = {
  name: "",
  currentPage: 1,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    changeFilter: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      state.currentPage = 1;
    },
    changePage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { changeFilter, changePage } = filtersSlice.actions;
export const selectNameFilter = (state: RootState) => state.filters.name;
export const selectCurrentPage = (state: RootState) =>
  state.filters.currentPage;

export default filtersSlice.reducer;
