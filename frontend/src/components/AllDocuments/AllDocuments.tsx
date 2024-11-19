import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  fetchAllDocuments,
  uploadDocumentForUser,
  deleteDocument,
  selectUserDocuments,
  selectDocumentLoading,
  selectDocumentError,
  selectDocumentSuccess,
  clearMessages,
} from "../../redux/slices/documentSlice";
import { selectAuthToken } from "../../redux/slices/authSlice";
import { fetchUserByName } from "../../services/authService";
import styles from "./AllDocuments.module.css";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import { useParams } from "react-router-dom";

const AllDocuments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectAuthToken);
  const documents = useSelector(selectUserDocuments);
  const loading = useSelector(selectDocumentLoading);
  const error = useSelector(selectDocumentError);
  const successMessage = useSelector(selectDocumentSuccess);
  const { userId: paramUserId } = useParams<{ userId: string }>();
  // const [userName, setUserName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [searchUserName, setSearchUserName] = useState<string>("");
  const [filteredDocuments, setFilteredDocuments] = useState<any[]>(documents);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [userId, setUserId] = useState<number | null>(
    paramUserId ? parseInt(paramUserId) : null
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchAllDocuments(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    setFilteredDocuments(documents);
  }, [documents]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, { autoClose: 2000 });
      dispatch(clearMessages());
      if (token) {
        dispatch(fetchAllDocuments(token));
      }
    }
    if (error) {
      toast.error(error, { autoClose: 2000 });
      dispatch(clearMessages());
    }
  }, [successMessage, error, dispatch, token]);

  const handleUserSearchForFilter = async () => {
    if (!searchUserName) {
      setFilteredDocuments(documents);
      setUserId(null);
      return;
    }

    try {
      const user = await fetchUserByName(searchUserName, token as string);
      if (user) {
        setUserId(user.id);
        const userDocs = documents.filter(
          (doc) => doc.uploadedBy?.id === user.id
        );
        setFilteredDocuments(userDocs);
        toast.success(`User found: ${user.name}`);
      } else {
        setFilteredDocuments([]);
        setUserId(null);
        toast.error(`User with name ${searchUserName} not found.`);
      }
    } catch (err) {
      console.error("Ошибка при поиске пользователя:", err);
      setFilteredDocuments([]);
      setUserId(null);
      toast.error("Failed to find user. Please check the name and try again.");
    }
  };

  const handleShowAllDocuments = () => {
    setFilteredDocuments(documents);
    setUserId(null);
    setSearchUserName("");
  };

  const handleUpload = () => {
    if (userId === null || !file) {
      alert("Please find the user and select a file to upload.");
      return;
    }

    if (token) {
      dispatch(uploadDocumentForUser({ userId, file, description, token }))
        .unwrap()
        .then(() => {
          if (token) {
            dispatch(fetchAllDocuments(token));
          }
          toast.success("Document uploaded successfully", { autoClose: 2000 });
        })
        .catch((uploadError) => {
          console.error("Ошибка при загрузке документа:", uploadError);
          toast.error("Error uploading document, please try again.");
        });
    }
  };

  const handleDelete = (documentId: string) => {
    if (token) {
      dispatch(deleteDocument({ documentId, token }))
        .unwrap()
        .then(() => {
          toast.success("Document deleted successfully", { autoClose: 2000 });
          if (token) {
            dispatch(fetchAllDocuments(token));
          }
        })
        .catch((deleteError) => {
          console.error("Ошибка при удалении документа:", deleteError);
          toast.error("Error deleting document, please try again.");
        });
    }
  };

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  const currentDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    <section className={styles.allDocumentsContainer}>
      <h2 className={styles.title}>Manage Documents</h2>
      {loading && <Loader />}
      <div className={styles.filterSection}>
        <h3>Filter Documents by User Name</h3>
        <input
          type="text"
          placeholder="Enter user name to filter documents"
          value={searchUserName}
          onChange={(e) => setSearchUserName(e.target.value)}
          className={styles.inputField}
        />
        <button
          onClick={handleUserSearchForFilter}
          className={styles.searchButton}
        >
          Filter Documents
        </button>
        {userId !== null && (
          <button
            onClick={handleShowAllDocuments}
            className={styles.showAllButton}
          >
            All Documents
          </button>
        )}
      </div>
      {userId !== null && (
        <div className={styles.uploadSection}>
          <h3>Upload document for user</h3>
          <input
            type="file"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.inputField}
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className={styles.uploadButton}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}
      <div className={styles.documentsList}>
        {currentDocuments.length > 0 ? (
          currentDocuments.map((document: any) => (
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
              <button
                className={styles.downloadButton}
                onClick={() =>
                  handleDownload(document.filepath, document.filename)
                }
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
          <p>There are no documents yet.</p>
        )}
      </div>
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
    </section>
  );
};

const handleDownload = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
    toast.success("Document downloaded successfully", { autoClose: 2000 });
  } catch (error) {
    console.error("Error downloading document:", error);
    toast.error("Failed to download document. Please try again later.", {
      autoClose: 2000,
    });
  }
};

export default AllDocuments;
