import { Schema, model, Document } from 'mongoose';

export interface IRoomSettings {
  allowVoiceChat: boolean;
  allowScreenShare: boolean;
  allowMusicShare: boolean;
  allowFileShare: boolean;
  moderationEnabled: boolean;
}

export interface IRoom extends Document {
  _id: string;
  name: string;
  description?: string;
  type: 'public' | 'private';
  ownerId: string;
  members: string[];
  maxMembers: number;
  isActive: boolean;
  settings: IRoomSettings;
  createdAt: Date;
  updatedAt: Date;
}

const roomSettingsSchema = new Schema<IRoomSettings>({
  allowVoiceChat: { type: Boolean, default: true },
  allowScreenShare: { type: Boolean, default: true },
  allowMusicShare: { type: Boolean, default: true },
  allowFileShare: { type: Boolean, default: true },
  moderationEnabled: { type: Boolean, default: false }
}, { _id: false });

const roomSchema = new Schema<IRoom>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  description: {
    type: String,
    maxlength: 200,
    default: ''
  },
  type: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  ownerId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: true
  },
  members: [{
    type: Schema.Types.ObjectId as any,
    ref: 'User'
  }],
  maxMembers: {
    type: Number,
    default: 50,
    min: 2,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    type: roomSettingsSchema,
    default: () => ({})
  }
}, {
  timestamps: true
});

// Indexes for performance
roomSchema.index({ ownerId: 1 });
roomSchema.index({ type: 1, isActive: 1 });
roomSchema.index({ members: 1 });

export const Room = model<IRoom>('Room', roomSchema);