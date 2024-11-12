// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../redux/store";
// import {
//   uploadDocumentThunk,
//   fetchUserDocumentsThunk,
// } from "../../redux/slices/documentSlice";
// import styles from "./UserDocuments.module.css";

// const UserDocuments = () => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [uploadInProgress, setUploadInProgress] = useState(false);
//   const dispatch = useDispatch<AppDispatch>();

//   // Получаем список документов из redux state
//   const documents = useSelector((state: RootState) => state.documents.items);
//   const user = useSelector((state: RootState) => state.auth.user);

//   useEffect(() => {
//     // Загружаем документы для текущего пользователя при первой загрузке компонента
//     if (user) {
//       dispatch(fetchUserDocumentsThunk());
//     }
//   }, [dispatch, user]);

//   // Обработка изменения выбранного файла
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       setSelectedFile(event.target.files[0]);
//     }
//   };

//   // Обработка загрузки файла
//   const handleUpload = async () => {
//     if (!selectedFile) {
//       alert("Выберите файл для загрузки");
//       return;
//     }

//     setUploadInProgress(true);
//     try {
//       // Загружаем документ через redux thunk
//       await dispatch(uploadDocumentThunk(selectedFile));
//       console.log("Файл успешно загружен");
//       setSelectedFile(null);
//     } catch (error) {
//       console.error("Ошибка при загрузке файла:", error);
//     } finally {
//       setUploadInProgress(false);
//     }
//   };

//   return (
//     <div className={styles.documentsSection}>
//       <div className={styles.uploadContainer}>
//         <input
//           type="file"
//           onChange={handleFileChange}
//           className={styles.input}
//         />
//         <button
//           onClick={handleUpload}
//           disabled={uploadInProgress || !selectedFile}
//         >
//           {uploadInProgress ? "Uploading..." : "Upload"}
//         </button>
//       </div>

//       <h3>My documents:</h3>
//       <ul>
//         {documents && documents.length > 0 ? (
//           documents.map((doc: any) => (
//             <li key={doc.id}>
//               <a href={doc.url} target="_blank" rel="noopener noreferrer">
//                 {doc.name}
//               </a>
//             </li>
//           ))
//         ) : (
//           <p>You don't have any uploaded documens</p>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default UserDocuments;
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  uploadDocumentThunk,
  fetchUserDocumentsThunk,
} from "../../redux/slices/documentSlice";
import styles from "./UserDocuments.module.css";

const UserDocuments = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Получаем список документов из redux state
  const documents = useSelector((state: RootState) => state.documents.items);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Загружаем документы для текущего пользователя при первой загрузке компонента
    if (user) {
      dispatch(fetchUserDocumentsThunk());
    }
  }, [dispatch, user]);

  // Обработка изменения выбранного файла
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Обработка загрузки файла
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Выберите файл для загрузки");
      return;
    }

    setUploadInProgress(true);
    try {
      // Загружаем документ через redux thunk
      await dispatch(uploadDocumentThunk(selectedFile));
      console.log("Файл успешно загружен");
      setSelectedFile(null);
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
    } finally {
      setUploadInProgress(false);
    }
  };

  return (
    <div className={styles.documentsContainer}>
      <div className={styles.fileInputContainer}>
        <input
          type="file"
          className={styles.fileInput}
          onChange={handleFileChange}
        />
        <button
          className={styles.uploadButton}
          onClick={handleUpload}
          disabled={uploadInProgress || !selectedFile}
        >
          {uploadInProgress ? "Uploading..." : "Upload"}
        </button>
      </div>

      <div className={styles.documentsList}>
        <h3 className={styles.titleList}>Uploaded documnets:</h3>
        <ul>
          {documents && documents.length > 0 ? (
            documents.map((doc: any) => (
              <li key={doc.id} className={styles.documentItem}>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.documentLink}
                >
                  {doc.name}
                </a>
              </li>
            ))
          ) : (
            <p className={styles.nodocumnets}>
              You don't have any documens yet
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserDocuments;
