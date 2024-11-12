import axios from "axios";
import { DOCUMENTS_API_URL } from "../config/apiConfig";

// Загрузка документа на сервер
export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  // Отправляем файл на сервер с помощью POST-запроса
  const response = await axios.post(DOCUMENTS_API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true, // Отправляем куки вместе с запросом
  });
  console.log(response.data);
  return response.data;
};

// Получение документов пользователя
export const fetchUserDocuments = async () => {
  const response = await axios.get(`${DOCUMENTS_API_URL}/my`, {
    withCredentials: true, // Отправляем куки вместе с запросом
  });
  console.log(response.data);
  return response.data;
};
