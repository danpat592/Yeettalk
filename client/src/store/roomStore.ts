import { create } from 'zustand';
import type { Room, Message, User, RoomsResponse, RoomResponse, MessagesResponse } from '../types';
import { apiClient } from '../services/api';
import { socketService } from '../services/socket';

interface RoomState {
  rooms: Room[];
  currentRoom: Room | null;
  messages: Message[];
  onlineUsers: User[];
  typingUsers: string[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setRooms: (rooms: Room[]) => void;
  setCurrentRoom: (room: Room | null) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  removeMessage: (messageId: string) => void;
  setMessages: (messages: Message[]) => void;
  setOnlineUsers: (users: User[]) => void;
  addTypingUser: (userId: string) => void;
  removeTypingUser: (userId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  fetchRooms: () => Promise<void>;
  fetchRoom: (roomId: string) => Promise<void>;
  fetchMessages: (roomId: string, page?: number) => Promise<void>;
  createRoom: (roomData: any) => Promise<void>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
  sendMessage: (messageData: any) => Promise<void>;
}

export const useRoomStore = create<RoomState>((set) => ({
  rooms: [],
  currentRoom: null,
  messages: [],
  onlineUsers: [],
  typingUsers: [],
  loading: false,
  error: null,

  setRooms: (rooms) => set({ rooms }),
  
  setCurrentRoom: (room) => set({ currentRoom: room, messages: [] }),
  
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
  
  updateMessage: (messageId, updates) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === messageId ? { ...msg, ...updates } : msg
      ),
    }));
  },
  
  removeMessage: (messageId) => {
    set((state) => ({
      messages: state.messages.filter((msg) => msg._id !== messageId),
    }));
  },
  
  setMessages: (messages) => set({ messages }),
  
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  
  addTypingUser: (userId) => {
    set((state) => ({
      typingUsers: [...state.typingUsers.filter(id => id !== userId), userId],
    }));
  },
  
  removeTypingUser: (userId) => {
    set((state) => ({
      typingUsers: state.typingUsers.filter(id => id !== userId),
    }));
  },
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),

  fetchRooms: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.getRooms() as RoomsResponse;
      if (response.success) {
        set({ rooms: response.rooms, loading: false });
      } else {
        throw new Error(response.error || 'Failed to fetch rooms');
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch rooms',
      });
    }
  },

  fetchRoom: async (roomId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.getRoom(roomId) as RoomResponse;
      if (response.success) {
        set({ currentRoom: response.room, loading: false });
      } else {
        throw new Error(response.error || 'Failed to fetch room');
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch room',
      });
    }
  },

  fetchMessages: async (roomId, page = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.getMessages(roomId, page) as MessagesResponse;
      if (response.success) {
        if (page === 1) {
          set({ messages: response.messages, loading: false });
        } else {
          set((state) => ({
            messages: [...response.messages, ...state.messages],
            loading: false,
          }));
        }
      } else {
        throw new Error(response.error || 'Failed to fetch messages');
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch messages',
      });
    }
  },

  createRoom: async (roomData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.createRoom(roomData) as RoomResponse;
      if (response.success) {
        set((state) => ({
          rooms: [response.room, ...state.rooms],
          loading: false,
        }));
      } else {
        throw new Error(response.error || 'Failed to create room');
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create room',
      });
      throw error;
    }
  },

  joinRoom: async (roomId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.joinRoom(roomId) as RoomResponse;
      if (response.success) {
        socketService.joinRoom(roomId);
        set({ currentRoom: response.room, loading: false });
      } else {
        throw new Error(response.error || 'Failed to join room');
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to join room',
      });
      throw error;
    }
  },

  leaveRoom: async (roomId) => {
    try {
      await apiClient.leaveRoom(roomId);
      socketService.leaveRoom(roomId);
      set({ currentRoom: null, messages: [] });
    } catch (error) {
      console.error('Failed to leave room:', error);
    }
  },

  sendMessage: async (messageData) => {
    try {
      socketService.sendMessage(messageData);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to send message',
      });
    }
  },
}));