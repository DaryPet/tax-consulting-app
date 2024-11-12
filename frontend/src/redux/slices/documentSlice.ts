import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  uploadDocument,
  fetchUserDocuments,
} from "../../services/documentService";

export interface DocumentState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DocumentState = {
  items: [],
  loading: false,
  error: null,
};

// Асинхронный thunk для загрузки документа
export const uploadDocumentThunk = createAsyncThunk(
  "documents/uploadDocument",
  async (file: File, { rejectWithValue }) => {
    try {
      return await uploadDocument(file);
    } catch (error) {
      return rejectWithValue("Ошибка при загрузке документа");
    }
  }
);

// Асинхронный thunk для получения всех документов пользователя
export const fetchUserDocumentsThunk = createAsyncThunk(
  "documents/fetchUserDocuments",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUserDocuments();
    } catch (error) {
      return rejectWithValue("Ошибка при получении документов");
    }
  }
);

export const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadDocumentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDocumentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(uploadDocumentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserDocumentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDocumentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUserDocumentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default documentSlice.reducer;
