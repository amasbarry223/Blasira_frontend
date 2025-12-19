export interface VerificationRequest {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  documentId: number | null;
  documentStatus: string | null;
  documentUploadDate: string | null;
}
