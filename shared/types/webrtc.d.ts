export interface WebRTCOffer {
    sdp: RTCSessionDescriptionInit;
    userId: string;
    roomId: string;
    type: 'voice' | 'screen';
}
export interface WebRTCAnswer {
    sdp: RTCSessionDescriptionInit;
    userId: string;
    roomId: string;
    type: 'voice' | 'screen';
}
export interface WebRTCIceCandidate {
    candidate: RTCIceCandidateInit;
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
    iceServers: RTCIceServer[];
    iceCandidatePoolSize?: number;
}
//# sourceMappingURL=webrtc.d.ts.map