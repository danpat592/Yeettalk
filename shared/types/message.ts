export interface Message {
  _id: string;
  roomId: string;
  userId: string;
  username: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'system';
  replyTo?: string;
  reactions: MessageReaction[];
  edited: boolean;
  editedAt?: Date;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageReaction {
  userId: string;
  emoji: string;
  createdAt: Date;
}

export interface SendMessageRequest {
  roomId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
  replyTo?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface TypingIndicator {
  userId: string;
  username: string;
  roomId: string;
  isTyping: boolean;
}