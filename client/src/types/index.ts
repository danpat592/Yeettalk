// Re-export shared types for client use
export * from '../../../shared';

// Import types for local use
import type { User } from '../../../shared';
import type { Room } from '../../../shared';
import type { Message } from '../../../shared';

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