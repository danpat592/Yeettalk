// User types
export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
  rooms: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Room types
export interface Room {
  _id: string;
  name: string;
  description?: string;
  type: 'public' | 'private';
  ownerId: string;
  members: string[];
  maxMembers: number;
  isActive: boolean;
  settings: RoomSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomSettings {
  allowVoiceChat: boolean;
  allowScreenShare: boolean;
  allowMusicShare: boolean;
  allowFileShare: boolean;
  moderationEnabled: boolean;
}

// Message types
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

// Client-specific types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SocketState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
}

// API Response types
export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  refreshToken: string;
  error?: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  error?: string;
}

export interface UserResponse {
  success: boolean;
  user: User;
  error?: string;
}

export interface RoomsResponse {
  success: boolean;
  rooms: Room[];
  error?: string;
}

export interface RoomResponse {
  success: boolean;
  room: Room;
  error?: string;
}

export interface MessagesResponse {
  success: boolean;
  messages: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
}