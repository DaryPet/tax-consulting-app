import { IsOptional, IsNumber } from 'class-validator';

export class CreateDocumentDto {
  @IsOptional()
  @IsNumber()
  userId?: number;
  name: string;
  description?: string;
  uploadedBy: string;
}

export class UpdateDocumentDto {
  name?: string;
  description?: string;
}
