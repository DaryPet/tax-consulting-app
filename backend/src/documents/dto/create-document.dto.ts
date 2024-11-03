// backend/src/documents/dto/create-document.dto.ts
export class CreateDocumentDto {
  name: string;
  description?: string;
  uploadedBy: string; // Имя или ID пользователя, который загрузил документ
}

// backend/src/documents/dto/update-document.dto.ts
export class UpdateDocumentDto {
  name?: string;
  description?: string;
}
