// backend/src/documents/dto/create-document.dto.ts
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateDocumentDto {
  @IsOptional()
  @IsNumber()
  userId?: number;
  name: string;
  description?: string;
  uploadedBy: string; // Имя или ID пользователя, который загрузил документ
}

// backend/src/documents/dto/update-document.dto.ts
export class UpdateDocumentDto {
  name?: string;
  description?: string;
}
