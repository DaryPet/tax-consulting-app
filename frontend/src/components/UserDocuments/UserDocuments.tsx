import React, { useEffect, useState } from "react";
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
  const [description, setDescription] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile && token) {
      dispatch(uploadDocument({ file: selectedFile, description, token }))
        .unwrap()
        .then(() => {
          setSelectedFile(null);
          setDescription("");
          toast.success("Document uploaded successfully", { autoClose: 2000 });
        })
        .catch((uploadError) => {
          console.error("Ошибка при загрузке документа:", uploadError);
          toast.error("Error uploading document, please try again.");
        });
    } else {
      toast.error("Please select a file and provide a description", {
        autoClose: 2000,
      });
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

  const indexOfLastDocument = currentPage * itemsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - itemsPerPage;
  const currentDocuments = documents.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );

  const totalPages = Math.ceil(documents.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={styles.documentsSection}>
      <h2>Upload and Manage Documents</h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className={styles.fileInputContainer}>
            <input type="file" onChange={handleFileSelect} />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.descriptionInput}
            />
            <button
              className={styles.uploadButton}
              onClick={handleUpload}
              disabled={selectedFile === null}
            >
              Upload
            </button>
          </div>
          <div className={styles.documentsList}>
            <h3>Your Documents:</h3>
            {currentDocuments.length > 0 ? (
              currentDocuments.map((document) => (
                <div key={document.id} className={styles.documentItem}>
                  <div className={styles.documentDetails}>
                    <p>
                      <strong>Filename:</strong> {document.filename}
                    </p>
                    <p>
                      <strong>Description:</strong> {document.description}
                    </p>
                    <p>
                      <strong>Uploaded By:</strong>{" "}
                      {document.uploadedBy?.name ?? "Unknown"}
                    </p>
                  </div>
                  <div className={styles.buttonContainer}>
                    <button
                      className={styles.downloadButton}
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
                </div>
              ))
            ) : (
              <p>No documents found</p>
            )}
            <div className={styles.pagination}>
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Documents;
