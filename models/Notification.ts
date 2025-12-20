export interface NotificationHistoryItem {
  id: number;
  senderAdminId: number;
  senderAdminName: string;
  title: string;
  content: string;
  type: string; // e.g., "BROADCAST"
  recipientIds: number[];
  sentAt: string; // ISO date string
}
