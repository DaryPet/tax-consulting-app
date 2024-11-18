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
  const documents = useSelector(selectUserDocuments) || [];
  const loading = useSelector(selectDocumentLoading);
  const error = useSelector(selectDocumentError);
  const successMessage = useSelector(selectDocumentSuccess);
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const [userName, setUserName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  // const [userId, setUserId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(
    paramUserId ? parseInt(paramUserId) : null
  );
  // Фетчим все документы при первом рендере
  useEffect(() => {
    if (token) {
      dispatch(fetchAllDocuments(token));
    }
  }, [dispatch, token]);

  // Используем эффект для обработки успеха и ошибок
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, { autoClose: 2000 });
      dispatch(clearMessages());
      // Обновляем список документов после успешного добавления
      if (token) {
        dispatch(fetchAllDocuments(token));
      }
    }
    if (error) {
      toast.error(error, { autoClose: 2000 });
      dispatch(clearMessages());
    }
  }, [successMessage, error, dispatch, token]);

  // Поиск пользователя по имени и сохранение userId для загрузки документа
  const handleUserSearch = async () => {
    if (!userName) {
      alert("Please enter the user's name.");
      return;
    }

    try {
      const user = await fetchUserByName(userName, token as string);
      if (user) {
        setUserId(user.id);
        toast.success(`User found: ${userName}, ID: ${user.id}`);
      } else {
        setUserId(null);
        toast.error(`User with name ${userName} not found.`);
      }
    } catch (err) {
      console.error("Ошибка при поиске пользователя:", err);
      setUserId(null);
      toast.error("Failed to find user. Please check the name and try again.");
    }
  };

  // Загрузка документа для определенного пользователя
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

  return (
    <section className={styles.allDocumentsContainer}>
      <h2>Manage Documents</h2>
      {loading && <Loader />}

      <div className={styles.uploadSection}>
        <h3>Upload document for user</h3>
        <div className={styles.userSearchContainer}>
          <input
            type="text"
            placeholder="Put user name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className={styles.inputField}
          />
          <button onClick={handleUserSearch} className={styles.searchButton}>
            Find user
          </button>
        </div>
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

      <div className={styles.documentsList}>
        <h3>All Documents:</h3>
        {documents.length > 0 ? (
          documents.map((document: any) => (
            <div key={document.id} className={styles.documentItem}>
              <p>{document.filename}</p>
              <p>description: {document.description}</p>
              <p>Uploaded By: {document.uploadedBy?.name ?? "Unknown"}</p>
              <button
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
          <p>There are no document yet.</p>
        )}
      </div>
    </section>
  );
};

// Функция для скачивания документа
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
