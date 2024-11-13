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
// frontend/src/components/Documents/Documents.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  uploadDocument,
  fetchUserDocuments,
  deleteDocument, // ИСПОЛЬЗУЕМ THUNK DELETE DOCUMENT
  clearMessages,
  selectUserDocuments,
  selectDocumentLoading,
  selectDocumentError,
  selectDocumentSuccess,
} from "../../redux/slices/documentSlice";
import { selectAuthToken } from "../../redux/slices/authSlice";
import styles from "./UserDocuments.module.css";
import { downloadDocumentApi } from "../../services/documentService"; // ТОЛЬКО ДЛЯ СКАЧИВАНИЯ
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Documents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectAuthToken); // Токен текущего пользователя
  const documents = useSelector(selectUserDocuments); // Документы, подгруженные для текущего пользователя
  const loading = useSelector(selectDocumentLoading);
  const error = useSelector(selectDocumentError);
  const successMessage = useSelector(selectDocumentSuccess);

  // Подгружаем документы текущего пользователя
  useEffect(() => {
    if (token) {
      dispatch(fetchUserDocuments(token));
    }
  }, [dispatch, token]);

  // Обработчик для загрузки файла
  const handleDownload = async (documentId: string) => {
    if (token) {
      try {
        await downloadDocumentApi(documentId, token); // Скачиваем документ, используя идентификатор документа и токен
        toast.success("Document downloaded successfully");
      } catch (error) {
        console.error("Error downloading document:", error);
        toast.error("Failed to download document. Please try again later.");
      }
    }
  };

  // Обработчик для удаления файла
  const handleDelete = (documentId: string) => {
    if (token) {
      dispatch(deleteDocument({ documentId, token }));
    }
  };

  // Устанавливаем toast для сообщений об успехе или ошибке
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }

    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [successMessage, error, dispatch]);

  return (
    <div className={styles.documentsSection}>
      <ToastContainer /> {/* Контейнер для отображения уведомлений */}
      <h2>Upload and Manage Documents</h2>
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (token) {
              dispatch(uploadDocument({ file, token }));
            }
          }
        }}
      />
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
