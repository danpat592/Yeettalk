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
export interface RoomMember {
    userId: string;
    username: string;
    avatar?: string;
    role: 'owner' | 'moderator' | 'member';
    isOnline: boolean;
    isMuted: boolean;
    isVideoEnabled: boolean;
    joinedAt: Date;
}
export interface CreateRoomRequest {
    name: string;
    description?: string;
    type: 'public' | 'private';
    maxMembers: number;
    settings: RoomSettings;
}
export interface JoinRoomRequest {
    roomId: string;
    password?: string;
}
//# sourceMappingURL=room.d.ts.map