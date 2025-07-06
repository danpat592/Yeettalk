const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Merge with any existing headers
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'Network error',
      }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Authentication
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async refreshToken(refreshToken: string) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // Rooms
  async getRooms() {
    return this.request('/rooms/my-rooms');
  }

  async getPublicRooms() {
    return this.request('/rooms/public');
  }

  async getRoom(roomId: string) {
    return this.request(`/rooms/${roomId}`);
  }

  async createRoom(roomData: any) {
    return this.request('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  }

  async joinRoom(roomId: string) {
    return this.request(`/rooms/${roomId}/join`, {
      method: 'POST',
    });
  }

  async leaveRoom(roomId: string) {
    return this.request(`/rooms/${roomId}/leave`, {
      method: 'POST',
    });
  }

  async updateRoom(roomId: string, updates: any) {
    return this.request(`/rooms/${roomId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteRoom(roomId: string) {
    return this.request(`/rooms/${roomId}`, {
      method: 'DELETE',
    });
  }

  // Messages
  async getMessages(roomId: string, page = 1, limit = 50) {
    return this.request(`/messages/room/${roomId}?page=${page}&limit=${limit}`);
  }

  async sendMessage(messageData: any) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async editMessage(messageId: string, content: string) {
    return this.request(`/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async deleteMessage(messageId: string) {
    return this.request(`/messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  async reactToMessage(messageId: string, emoji: string) {
    return this.request(`/messages/${messageId}/react`, {
      method: 'POST',
      body: JSON.stringify({ emoji }),
    });
  }

  // Users
  async getUsers(search?: string, page = 1, limit = 20) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) params.append('search', search);
    
    return this.request(`/users?${params}`);
  }

  async getUser(userId: string) {
    return this.request(`/users/${userId}`);
  }

  async updateProfile(profileData: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updateStatus(isOnline: boolean) {
    return this.request('/users/status', {
      method: 'PUT',
      body: JSON.stringify({ isOnline }),
    });
  }

  async getOnlineUsers() {
    return this.request('/users/online/list');
  }

  // Music
  async getRoomMusic(roomId: string) {
    return this.request(`/music/room/${roomId}`);
  }

  async uploadMusic(formData: FormData) {
    return this.request('/music/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  // Files
  async uploadFile(formData: FormData) {
    return this.request('/files/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;