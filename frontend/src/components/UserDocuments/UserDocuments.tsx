import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  uploadDocument,
  fetchUserDocuments,
  selectUserDocuments,
  selectDocumentLoading,
  selectDocumentError,
  selectDocumentSuccess,
  deleteDocument,
  clearMessages,
} from "../../redux/slices/documentSlice";
import { selectAuthToken } from "../../redux/slices/authSlice";
import styles from "./UserDocuments.module.css";
import { downloadDocumentApi } from "../../services/documentService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader/Loader";

const Documents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectAuthToken);
  const documents = useSelector(selectUserDocuments) || [];
  const loading = useSelector(selectDocumentLoading);
  const error = useSelector(selectDocumentError);
  const successMessage = useSelector(selectDocumentSuccess);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserDocuments(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, { autoClose: 2000 });
      dispatch(clearMessages());
    }
    if (error) {
      toast.error(error, { autoClose: 2000 });
      dispatch(clearMessages());
    }
  }, [successMessage, error, dispatch]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (token) {
        dispatch(uploadDocument({ file, token }));
      }
    }
  };

  const handleDownload = async (documentId: string) => {
    if (token) {
      try {
        await downloadDocumentApi(documentId, token);
        toast.success("Document downloaded successfully", { autoClose: 2000 });
      } catch (error) {
        console.error("Error downloading document:", error);
        toast.error("Failed to download document. Please try again later.", {
          autoClose: 2000,
        });
      }
    }
  };

  const handleDelete = (documentId: string) => {
    if (token) {
      dispatch(deleteDocument({ documentId, token }));
    }
  };

  return (
    <div className={styles.documentsSection}>
      <h2>Upload and Manage Documents</h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          <input type="file" onChange={handleFileUpload} />
          <div className={styles.documentsList}>
            <h3>Your Documents:</h3>
            {documents.length > 0 ? (
              documents.map((document) => (
                <div key={document.id} className={styles.documentItem}>
                  <p>{document.filename}</p>
                  <button
                    onClick={() => handleDownload(document.id.toString())}
                  >
                    Download
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(document.id.toString())}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No documents found</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Documents;
