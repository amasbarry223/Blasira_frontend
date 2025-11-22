import { DocumentType, DocumentStatus } from './enums';

export interface Document {
  id: number;
  documentType: DocumentType;
  fileUrl: string;
  status: DocumentStatus;
  uploadedAt: Date | null;
  driverProfileId: number;
}

export interface CreateDocumentDto {
  documentType: DocumentType;
  fileUrl: string;
  status: DocumentStatus;
  driverProfileId: number;
}

export interface UpdateDocumentDto {
  documentType?: DocumentType;
  fileUrl?: string;
  status?: DocumentStatus;
}

