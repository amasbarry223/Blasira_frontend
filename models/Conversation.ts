export interface Conversation {
  id: number;
}

export interface ConversationParticipant {
  conversationId: number;
  userProfileId: number;
}

export interface CreateConversationDto {
  participantIds: number[];
}

export interface ConversationWithParticipants extends Conversation {
  participants: number[];
}

