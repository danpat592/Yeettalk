import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '../../../shared';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        token,
      },
      transports: ['websocket'],
    });

    this.setupEventHandlers();
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  // Room methods
  joinRoom(roomId: string) {
    this.socket?.emit(SOCKET_EVENTS.JOIN_ROOM, roomId);
  }

  leaveRoom(roomId: string) {
    this.socket?.emit(SOCKET_EVENTS.LEAVE_ROOM, roomId);
  }

  // Message methods
  sendMessage(messageData: any) {
    this.socket?.emit(SOCKET_EVENTS.SEND_MESSAGE, messageData);
  }

  startTyping(roomId: string) {
    this.socket?.emit(SOCKET_EVENTS.TYPING_START, { roomId });
  }

  stopTyping(roomId: string) {
    this.socket?.emit(SOCKET_EVENTS.TYPING_STOP, { roomId });
  }

  // Voice methods
  sendVoiceOffer(roomId: string, targetUserId: string, sdp: RTCSessionDescriptionInit) {
    this.socket?.emit(SOCKET_EVENTS.VOICE_OFFER, { roomId, targetUserId, sdp });
  }

  sendVoiceAnswer(roomId: string, targetUserId: string, sdp: RTCSessionDescriptionInit) {
    this.socket?.emit(SOCKET_EVENTS.VOICE_ANSWER, { roomId, targetUserId, sdp });
  }

  sendVoiceIceCandidate(roomId: string, targetUserId: string, candidate: RTCIceCandidateInit) {
    this.socket?.emit(SOCKET_EVENTS.VOICE_ICE_CANDIDATE, { roomId, targetUserId, candidate });
  }

  updateVoiceState(roomId: string, isMuted: boolean, isSpeaking: boolean) {
    this.socket?.emit(SOCKET_EVENTS.VOICE_STATE_CHANGED, { roomId, isMuted, isSpeaking });
  }

  // Screen share methods
  startScreenShare(roomId: string) {
    this.socket?.emit(SOCKET_EVENTS.SCREEN_SHARE_START, { roomId });
  }

  stopScreenShare(roomId: string) {
    this.socket?.emit(SOCKET_EVENTS.SCREEN_SHARE_STOP, { roomId });
  }

  sendScreenShareOffer(roomId: string, targetUserId: string, sdp: RTCSessionDescriptionInit) {
    this.socket?.emit(SOCKET_EVENTS.SCREEN_SHARE_OFFER, { roomId, targetUserId, sdp });
  }

  sendScreenShareAnswer(roomId: string, targetUserId: string, sdp: RTCSessionDescriptionInit) {
    this.socket?.emit(SOCKET_EVENTS.SCREEN_SHARE_ANSWER, { roomId, targetUserId, sdp });
  }

  sendScreenShareIceCandidate(roomId: string, targetUserId: string, candidate: RTCIceCandidateInit) {
    this.socket?.emit(SOCKET_EVENTS.SCREEN_SHARE_ICE_CANDIDATE, { roomId, targetUserId, candidate });
  }

  // Music methods
  playMusic(roomId: string, musicId: string) {
    this.socket?.emit(SOCKET_EVENTS.MUSIC_PLAY, { roomId, musicId });
  }

  pauseMusic(roomId: string) {
    this.socket?.emit(SOCKET_EVENTS.MUSIC_PAUSE, { roomId });
  }

  nextMusic(roomId: string) {
    this.socket?.emit(SOCKET_EVENTS.MUSIC_NEXT, { roomId });
  }

  seekMusic(roomId: string, position: number) {
    this.socket?.emit(SOCKET_EVENTS.MUSIC_SEEK, { roomId, position });
  }

  // Event listeners
  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }

  // Helper methods
  get connected() {
    return this.socket?.connected || false;
  }

  get id() {
    return this.socket?.id;
  }
}

export const socketService = new SocketService();
export default socketService;