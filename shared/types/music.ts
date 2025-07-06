export interface Music {
  _id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  fileUrl?: string;
  externalUrl?: string;
  thumbnailUrl?: string;
  source: 'upload' | 'youtube' | 'spotify';
  uploadedBy: string;
  roomId: string;
  createdAt: Date;
}

export interface Playlist {
  _id: string;
  roomId: string;
  songs: PlaylistSong[];
  currentSong?: string;
  currentTime: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaylistSong {
  musicId: string;
  music: Music;
  addedBy: string;
  votes: Vote[];
  position: number;
  addedAt: Date;
}

export interface Vote {
  userId: string;
  type: 'upvote' | 'downvote';
  createdAt: Date;
}

export interface MusicUploadRequest {
  title: string;
  artist: string;
  album?: string;
  file: File;
  roomId: string;
}

export interface MusicControlRequest {
  roomId: string;
  action: 'play' | 'pause' | 'next' | 'previous' | 'seek';
  position?: number;
}

export interface MusicVoteRequest {
  roomId: string;
  musicId: string;
  type: 'upvote' | 'downvote';
}