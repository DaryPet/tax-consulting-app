import { DOCUMENTS_URL, DOCUMENTS_MY_URL } from "../config/apiConfig";

// ФУНКЦИЯ ДЛЯ ЗАГРУЗКИ НОВОГО ДОКУМЕНТА
export const uploadDocumentApi = async ({
  file,
  description,
  token,
}: {
  file: File;
  description?: string;
  token: string;
}): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);
  if (description) {
    formData.append("description", description);
  }

  const response = await fetch(DOCUMENTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload document");
  }

  return await response.json();
};

// ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ВСЕХ ДОКУМЕНТОВ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
export const fetchUserDocumentsApi = async (token: string): Promise<any> => {
  const response = await fetch(DOCUMENTS_MY_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user documents");
  }

  return await response.json();
};

// ФУНКЦИЯ ДЛЯ СКАЧИВАНИЯ ДОКУМЕНТА
export const downloadDocumentApi = async (
  documentId: string,
  token: string
): Promise<void> => {
  try {
    if (!documentId) {
      throw new Error("Document ID is not provided");
    }

    const url = `${DOCUMENTS_URL}download/${documentId}`;
    console.log(`Attempting to download document from URL: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to download document. Status: ${response.status} ${response.statusText}`
      );
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;

    // Пытаемся извлечь имя файла из заголовка Content-Disposition
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = "document.pdf"; // Значение по умолчанию, если имя файла не указано в заголовке

    if (contentDisposition && contentDisposition.includes("filename=")) {
      const matches = contentDisposition.match(/filename=\"(.+)\"/);
      if (matches && matches[1]) {
        filename = matches[1];
      }
    }

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Освобождаем URL
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Error while downloading document:", error);
    throw error;
  }
};
export const deleteDocumentApi = async (
  documentId: string,
  token: string
): Promise<void> => {
  const response = await fetch(`${DOCUMENTS_URL}${documentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete document");
  }
};
