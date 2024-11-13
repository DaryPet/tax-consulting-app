// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   uploadDocument,
//   fetchUserDocuments,
// } from "../../services/documentService";

// export interface DocumentState {
//   items: any[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: DocumentState = {
//   items: [],
//   loading: false,
//   error: null,
// };

// // Асинхронный thunk для загрузки документа
// export const uploadDocumentThunk = createAsyncThunk(
//   "documents/uploadDocument",
//   async (file: File, { rejectWithValue }) => {
//     try {
//       return await uploadDocument(file);
//     } catch (error) {
//       return rejectWithValue("Ошибка при загрузке документа");
//     }
//   }
// );

// // Асинхронный thunk для получения всех документов пользователя
// export const fetchUserDocumentsThunk = createAsyncThunk(
//   "documents/fetchUserDocuments",
//   async (_, { rejectWithValue }) => {
//     try {
//       return await fetchUserDocuments();
//     } catch (error) {
//       return rejectWithValue("Ошибка при получении документов");
//     }
//   }
// );

// export const documentSlice = createSlice({
//   name: "documents",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(uploadDocumentThunk.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(uploadDocumentThunk.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items.push(action.payload);
//       })
//       .addCase(uploadDocumentThunk.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(fetchUserDocumentsThunk.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserDocumentsThunk.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload;
//       })
//       .addCase(fetchUserDocumentsThunk.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export default documentSlice.reducer;
// frontend/src/redux/slices/documentSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  uploadDocumentApi,
  fetchUserDocumentsApi,
  deleteDocumentApi,
} from "../../services/documentService";

// Интерфейсы для данных документов
interface Document {
  id: number;
  filename: string;
  description?: string;
  createdAt: string;
  filepath: string;
}

interface DocumentState {
  documents: Document[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: DocumentState = {
  documents: [],
  loading: false,
  error: null,
  successMessage: null,
};

// Асинхронный thunk для загрузки документа
export const uploadDocument = createAsyncThunk<
  Document,
  {
    file: File;
    description?: string;
    token: string;
  }
>("document/uploadDocument", async (documentData, { rejectWithValue }) => {
  try {
    return await uploadDocumentApi(documentData);
  } catch (error) {
    return rejectWithValue("Error uploading document");
  }
});

// Асинхронный thunk для получения всех документов текущего пользователя
export const fetchUserDocuments = createAsyncThunk<Document[], string>(
  "document/fetchUserDocuments",
  async (token, { rejectWithValue }) => {
    try {
      return await fetchUserDocumentsApi(token);
    } catch (error) {
      return rejectWithValue("Error fetching user documents");
    }
  }
);
export const deleteDocument = createAsyncThunk<
  void,
  { documentId: string; token: string },
  { rejectValue: string }
>(
  "documents/deleteDocument",
  async ({ documentId, token }, { rejectWithValue }) => {
    try {
      await deleteDocumentApi(documentId, token);
    } catch (error) {
      return rejectWithValue("Error deleting document");
    }
  }
);

// Slice для документов
const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка загрузки документа
      .addCase(uploadDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        uploadDocument.fulfilled,
        (state, action: PayloadAction<Document>) => {
          state.loading = false;
          state.successMessage = "Document successfully uploaded";
          state.documents.push(action.payload);
        }
      )
      .addCase(uploadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Обработка получения всех документов текущего пользователя
      .addCase(fetchUserDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserDocuments.fulfilled,
        (state, action: PayloadAction<Document[]>) => {
          state.loading = false;
          state.documents = action.payload;
        }
      )
      .addCase(fetchUserDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Document successfully deleted";
        state.documents = state.documents.filter(
          (doc) => doc.id !== Number(action.meta.arg.documentId)
        );
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = documentSlice.actions;

// Селекторы для получения данных из состояния документов
export const selectUserDocuments = (state: RootState) =>
  state.document.documents;
export const selectDocumentLoading = (state: RootState) =>
  state.document.loading;
export const selectDocumentError = (state: RootState) => state.document.error;
export const selectDocumentSuccess = (state: RootState) =>
  state.document.successMessage;

export default documentSlice.reducer;
