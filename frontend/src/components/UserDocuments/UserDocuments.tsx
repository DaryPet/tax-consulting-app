// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch } from "../../redux/store";
// import {
//   uploadDocument,
//   fetchUserDocuments,
//   selectUserDocuments,
//   selectDocumentLoading,
//   selectDocumentError,
//   selectDocumentSuccess,
//   deleteDocument,
// } from "../../redux/slices/documentSlice";
// import { selectAuthToken } from "../../redux/slices/authSlice";
// import styles from "./UserDocuments.module.css";
// import { downloadDocumentApi } from "../../services/documentService";

// const Documents: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const token = useSelector(selectAuthToken);
//   const documents = useSelector(selectUserDocuments);
//   const loading = useSelector(selectDocumentLoading);
//   const error = useSelector(selectDocumentError);
//   const successMessage = useSelector(selectDocumentSuccess);

//   useEffect(() => {
//     if (token) {
//       dispatch(fetchUserDocuments(token));
//     }
//   }, [dispatch, token]);

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       const file = event.target.files[0];
//       if (token) {
//         dispatch(uploadDocument({ file, token }));
//       }
//     }
//   };

//   const handleDownload = async (documentId: string) => {
//     if (token) {
//       try {
//         await downloadDocumentApi(documentId, token);
//       } catch (error) {
//         console.error("Error downloading document:", error);
//         // Возможно, показать сообщение пользователю
//       }
//     }
//   };
//   const handleDelete = (documentId: string) => {
//     if (token) {
//       dispatch(deleteDocument({ documentId, token }));
//     }
//   };
//   return (
//     <div className={styles.documentsSection}>
//       <h2>Upload and Manage Documents</h2>

//       {error && <div className={styles.errorMessage}>{error}</div>}
//       {successMessage && (
//         <div className={styles.successMessage}>{successMessage}</div>
//       )}

//       <input type="file" onChange={handleFileUpload} />
//       {loading && <p>Loading...</p>}

//       <div className={styles.documentsList}>
//         <h3>Your Documents:</h3>
//         {documents.length > 0 ? (
//           documents.map((document) => (
//             <div key={document.id} className={styles.documentItem}>
//               <p>{document.filename}</p>
//               <button onClick={() => handleDownload(document.id.toString())}>
//                 Download
//               </button>
//               <button
//                 className={styles.deleteButton}
//                 onClick={() => handleDelete(document.id.toString())}
//               >
//                 Delete
//               </button>
//             </div>
//           ))
//         ) : (
//           <p>No documents found</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Documents;
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

const Documents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectAuthToken);
  const documents = useSelector(selectUserDocuments) || [];
  const loading = useSelector(selectDocumentLoading);
  const error = useSelector(selectDocumentError);
  const successMessage = useSelector(selectDocumentSuccess);

  // Добавляем состояние для управления отображением сообщений
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchUserDocuments(token));
    }
  }, [dispatch, token]);

  // Устанавливаем сообщение об успехе или ошибке на основе Redux состояния
  useEffect(() => {
    if (successMessage) {
      setMessage(successMessage);
      setMessageType("success");
      dispatch(clearMessages());

      // Очищаем сообщение через 2 секунды
      const timer = setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 2000);

      return () => clearTimeout(timer);
    }

    if (error) {
      setMessage(error);
      setMessageType("error");
      dispatch(clearMessages());

      // Очищаем сообщение через 2 секунды
      const timer = setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 2000);

      return () => clearTimeout(timer);
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
        setMessage("Document downloaded successfully");
        setMessageType("success");
        // Очищаем сообщение через 2 секунды
        setTimeout(() => {
          setMessage(null);
          setMessageType(null);
        }, 2000);
      } catch (error) {
        console.error("Error downloading document:", error);
        setMessage("Failed to download document. Please try again later.");
        setMessageType("error");
        // Очищаем сообщение через 2 секунды
        setTimeout(() => {
          setMessage(null);
          setMessageType(null);
        }, 2000);
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

      {/* Сообщение об успехе или ошибке */}
      {message && (
        <div
          className={
            messageType === "success"
              ? styles.successBanner
              : styles.errorBanner
          }
        >
          {message}
        </div>
      )}

      <input type="file" onChange={handleFileUpload} />
      {loading && <p>Loading...</p>}

      <div className={styles.documentsList}>
        <h3>Your Documents:</h3>
        {documents.length > 0 ? (
          documents.map((document) => (
            <div key={document.id} className={styles.documentItem}>
              <p>{document.filename}</p>
              <button onClick={() => handleDownload(document.id.toString())}>
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
    </div>
  );
};

export default Documents;
