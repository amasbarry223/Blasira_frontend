export interface Message {
  id: number;
  content: string;
  isRead: boolean;
  sentAt: Date | null;
  conversationId: number;
  senderId: number;
}

export interface CreateMessageDto {
  content: string;
  conversationId: number;
  senderId: number;
}

export interface UpdateMessageDto {
  content?: string;
  isRead?: boolean;
}

export interface SendMessageRequest {
  recipientId: number;
  content: string;
}

export interface AdminBroadcastMessageRequest {
  recipientIds: number[];
  content: string;
}

