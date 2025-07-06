export interface WebRTCOffer {
  sdp: any; // RTCSessionDescriptionInit in browser
  userId: string;
  roomId: string;
  type: 'voice' | 'screen';
}

export interface WebRTCAnswer {
  sdp: any; // RTCSessionDescriptionInit in browser
  userId: string;
  roomId: string;
  type: 'voice' | 'screen';
}

export interface WebRTCIceCandidate {
  candidate: any; // RTCIceCandidateInit in browser
  userId: string;
  roomId: string;
  type: 'voice' | 'screen';
}

export interface VoiceState {
  userId: string;
  roomId: string;
  isMuted: boolean;
  isSpeaking: boolean;
  audioLevel: number;
}

export interface ScreenShareState {
  userId: string;
  roomId: string;
  isSharing: boolean;
  streamId?: string;
  resolution?: {
    width: number;
    height: number;
  };
}

export interface MediaDeviceInfo {
  deviceId: string;
  kind: 'audioinput' | 'audiooutput' | 'videoinput';
  label: string;
  groupId: string;
}

export interface RTCConfiguration {
  iceServers: any[]; // RTCIceServer[] in browser
  iceCandidatePoolSize?: number;
}