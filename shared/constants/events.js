"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEBRTC_EVENTS = exports.SOCKET_EVENTS = void 0;
// Socket.io Events
exports.SOCKET_EVENTS = {
    // Connection events
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    // Authentication events
    AUTHENTICATE: 'authenticate',
    AUTHENTICATED: 'authenticated',
    AUTHENTICATION_ERROR: 'authentication_error',
    // Room events
    JOIN_ROOM: 'join_room',
    LEAVE_ROOM: 'leave_room',
    ROOM_JOINED: 'room_joined',
    ROOM_LEFT: 'room_left',
    ROOM_UPDATED: 'room_updated',
    USER_JOINED_ROOM: 'user_joined_room',
    USER_LEFT_ROOM: 'user_left_room',
    // Message events
    SEND_MESSAGE: 'send_message',
    MESSAGE_SENT: 'message_sent',
    NEW_MESSAGE: 'new_message',
    MESSAGE_EDITED: 'message_edited',
    MESSAGE_DELETED: 'message_deleted',
    MESSAGE_REACTION: 'message_reaction',
    // Typing events
    TYPING_START: 'typing_start',
    TYPING_STOP: 'typing_stop',
    USER_TYPING: 'user_typing',
    // Voice events
    VOICE_STATE_CHANGED: 'voice_state_changed',
    VOICE_OFFER: 'voice_offer',
    VOICE_ANSWER: 'voice_answer',
    VOICE_ICE_CANDIDATE: 'voice_ice_candidate',
    // Screen share events
    SCREEN_SHARE_START: 'screen_share_start',
    SCREEN_SHARE_STOP: 'screen_share_stop',
    SCREEN_SHARE_OFFER: 'screen_share_offer',
    SCREEN_SHARE_ANSWER: 'screen_share_answer',
    SCREEN_SHARE_ICE_CANDIDATE: 'screen_share_ice_candidate',
    // Music events
    MUSIC_PLAY: 'music_play',
    MUSIC_PAUSE: 'music_pause',
    MUSIC_NEXT: 'music_next',
    MUSIC_PREVIOUS: 'music_previous',
    MUSIC_SEEK: 'music_seek',
    MUSIC_VOLUME_CHANGE: 'music_volume_change',
    MUSIC_QUEUE_UPDATED: 'music_queue_updated',
    MUSIC_VOTE: 'music_vote',
    // File upload events
    FILE_UPLOAD_START: 'file_upload_start',
    FILE_UPLOAD_PROGRESS: 'file_upload_progress',
    FILE_UPLOAD_COMPLETE: 'file_upload_complete',
    FILE_UPLOAD_ERROR: 'file_upload_error',
    // User presence events
    USER_ONLINE: 'user_online',
    USER_OFFLINE: 'user_offline',
    USER_STATUS_CHANGED: 'user_status_changed',
    // Error events
    ERROR: 'error',
    ROOM_ERROR: 'room_error',
    MESSAGE_ERROR: 'message_error',
    VOICE_ERROR: 'voice_error',
    SCREEN_SHARE_ERROR: 'screen_share_error',
    MUSIC_ERROR: 'music_error'
};
// WebRTC Events
exports.WEBRTC_EVENTS = {
    OFFER: 'offer',
    ANSWER: 'answer',
    ICE_CANDIDATE: 'ice-candidate',
    PEER_CONNECTED: 'peer-connected',
    PEER_DISCONNECTED: 'peer-disconnected',
    STREAM_ADDED: 'stream-added',
    STREAM_REMOVED: 'stream-removed'
};
//# sourceMappingURL=events.js.map