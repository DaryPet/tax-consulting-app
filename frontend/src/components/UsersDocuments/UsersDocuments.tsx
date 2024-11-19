// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { AppDispatch } from "../../redux/store";
// import {
//   deleteDocument,
//   selectUserDocuments,
//   selectDocumentLoading,
//   selectDocumentError,
//   selectDocumentSuccess,
//   clearMessages,
//   fetchDocumentsForUser,
// } from "../../redux/slices/documentSlice";
// import { selectAuthToken } from "../../redux/slices/authSlice";
// import { getUserById } from "../../services/authService";
// import Loader from "../Loader/Loader";
// import { toast } from "react-toastify";
// import styles from "./UsersDocuments.module.css";

// const UsersDocuments: React.FC = () => {
//   const { userId } = useParams<{ userId: string | undefined }>();
//   const dispatch = useDispatch<AppDispatch>();
//   const token = useSelector(selectAuthToken);
//   const documents = useSelector(selectUserDocuments) || [];
//   const loading = useSelector(selectDocumentLoading);
//   const error = useSelector(selectDocumentError);
//   const successMessage = useSelector(selectDocumentSuccess);
//   const [userName, setUserName] = useState<string>("");

//   // Fetching User Documents and User Info
//   useEffect(() => {
//     if (token && userId) {
//       dispatch(fetchDocumentsForUser({ userId: parseInt(userId, 10), token }))
//         .unwrap()
//         .then(() => {
//           getUserById(userId)
//             .then((user) => {
//               setUserName(user.name);
//             })
//             .catch((err) => {
//               console.error("Error fetching user by ID:", err);
//               toast.error("Error fetching user details.");
//             });
//         })
//         .catch((fetchError) => {
//           console.error("Error fetching documents:", fetchError);
//           toast.error("Error fetching user documents.");
//         });
//     }
//   }, [dispatch, token, userId]);

//   useEffect(() => {
//     if (successMessage) {
//       toast.success(successMessage, { autoClose: 2000 });
//       dispatch(clearMessages());
//     }
//     if (error) {
//       toast.error(error, { autoClose: 2000 });
//       dispatch(clearMessages());
//     }
//   }, [successMessage, error, dispatch]);

//   const handleDelete = (documentId: string) => {
//     if (token) {
//       dispatch(deleteDocument({ documentId, token }))
//         .unwrap()
//         .then(() => {
//           toast.success("Document deleted successfully", { autoClose: 2000 });
//           if (userId) {
//             dispatch(
//               fetchDocumentsForUser({ userId: parseInt(userId, 10), token })
//             );
//           }
//         })
//         .catch((deleteError) => {
//           console.error("Error deleting document:", deleteError);
//           toast.error("Error deleting document, please try again.");
//         });
//     }
//   };

//   const handleDownload = async (url: string, filename: string) => {
//     try {
//       const response = await fetch(url);
//       const blob = await response.blob();
//       const downloadUrl = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = downloadUrl;
//       link.download = filename;
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(downloadUrl);
//       toast.success("Document downloaded successfully", { autoClose: 2000 });
//     } catch (error) {
//       console.error("Error downloading document:", error);
//       toast.error("Failed to download document. Please try again later.", {
//         autoClose: 2000,
//       });
//     }
//   };

//   return (
//     <section className={styles.userDocumentsContainer}>
//       <h2>
//         {userName ? `${userName}'s Documents (Admin View)` : "User Documents"}
//       </h2>
//       {loading && <Loader />}
//       {!loading && documents.length > 0 ? (
//         <ul className={styles.documentsList}>
//           {documents.map((document) => (
//             <li key={document.id} className={styles.documentItem}>
//               <p>{document.filename}</p>
//               <button
//                 onClick={() =>
//                   handleDownload(document.filepath, document.filename)
//                 }
//               >
//                 Download
//               </button>
//               <button onClick={() => handleDelete(document.id.toString())}>
//                 Delete
//               </button>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No documents found for this user.</p>
//       )}
//     </section>
//   );
// };

// export default UsersDocuments;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchDocumentsForUser,
  selectUserDocuments,
  selectDocumentLoading,
  selectDocumentError,
  selectDocumentSuccess,
  clearMessages,
} from "../../redux/slices/documentSlice";
import { AppDispatch } from "../../redux/store";
import { selectAuthToken } from "../../redux/slices/authSlice";
import Loader from "../Loader/Loader";
import styles from "./UsersDocuments.module.css";
import { toast } from "react-toastify";

const UsersDocuments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectAuthToken);
  const { userId } = useParams<{ userId: string }>();
  const documents = useSelector(selectUserDocuments) || [];
  const loading = useSelector(selectDocumentLoading);
  const error = useSelector(selectDocumentError);
  const successMessage = useSelector(selectDocumentSuccess);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (token && userId) {
      dispatch(fetchDocumentsForUser({ userId: parseInt(userId, 10), token }));
    }
  }, [dispatch, token, userId]);

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

  return (
    <div className={styles.userDocumentsContainer}>
      <h2>Documents for User: {userName}</h2>
      {loading && <Loader />}
      {!loading && documents.length > 0 ? (
        <ul className={styles.documentsList}>
          {documents.map((document) => (
            <li key={document.id} className={styles.documentItem}>
              <p>{document.filename}</p>
              <button
                onClick={() =>
                  handleDownload(document.filepath, document.filename)
                }
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No documents found for this user.</p>
      )}
    </div>
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

export default UsersDocuments;