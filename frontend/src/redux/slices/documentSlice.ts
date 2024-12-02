import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  uploadDocumentApi,
  fetchUserDocumentsApi,
  deleteDocumentApi,
  fetchAllDocumentsApi,
  uploadDocumentForUserApi,
  fetchDocumentsForUserApi,
} from "../../services/documentService";

interface User {
  id: number;
  name: string;
}

interface Document {
  id: number;
  filename: string;
  description?: string;
  createdAt: string;
  filepath: string;
  uploadedBy: User;
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

export const uploadDocumentForUser = createAsyncThunk<
  void,
  { userId: number; file: File; description: string; token: string }
>(
  "documents/uploadDocumentForUser",
  async ({ userId, file, description, token }, { rejectWithValue }) => {
    try {
      await uploadDocumentForUserApi(String(userId), file, description, token);
    } catch (error) {
      return rejectWithValue("Error uploading document");
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
export const fetchAllDocuments = createAsyncThunk<Document[], string>(
  "documents/fetchAllDocuments",
  async (token, { rejectWithValue }) => {
    try {
      const documents = await fetchAllDocumentsApi(token);
      return documents;
    } catch (error) {
      return rejectWithValue("Error fetching all documents");
    }
  }
);
export const fetchDocumentsForUser = createAsyncThunk<
  any[],
  { userId: number; token: string }
>(
  "documents/fetchDocumentsForUser",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      return await fetchDocumentsForUserApi(userId, token);
    } catch (error) {
      return rejectWithValue("Error fetching documents for specific user");
    }
  }
);

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
      .addCase(uploadDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        uploadDocument.fulfilled,
        (state, action: PayloadAction<Document>) => {
          state.loading = false;
          state.documents.push(action.payload);
        }
      )
      .addCase(uploadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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
      })
      .addCase(fetchAllDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllDocuments.fulfilled,
        (state, action: PayloadAction<Document[]>) => {
          state.loading = false;
          state.documents = action.payload;
        }
      )
      .addCase(fetchAllDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadDocumentForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDocumentForUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadDocumentForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = documentSlice.actions;

export const selectUserDocuments = (state: RootState) =>
  state.document.documents;
export const selectDocumentLoading = (state: RootState) =>
  state.document.loading;
export const selectDocumentError = (state: RootState) => state.document.error;
export const selectDocumentSuccess = (state: RootState) =>
  state.document.successMessage;

export default documentSlice.reducer;
