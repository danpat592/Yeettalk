import { Schema, model, Document } from 'mongoose';

export interface IMessageReaction {
  userId: string;
  emoji: string;
  createdAt: Date;
}

export interface IMessage extends Document {
  _id: string;
  roomId: string;
  userId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'system';
  replyTo?: string;
  reactions: IMessageReaction[];
  edited: boolean;
  editedAt?: Date;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  createdAt: Date;
  updatedAt: Date;
}

const messageReactionSchema = new Schema<IMessageReaction>({
  userId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: true
  },
  emoji: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const messageSchema = new Schema<IMessage>({
  roomId: {
    type: Schema.Types.ObjectId as any,
    ref: 'Room',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'audio', 'video', 'system'],
    default: 'text'
  },
  replyTo: {
    type: Schema.Types.ObjectId as any,
    ref: 'Message',
    default: null
  },
  reactions: [messageReactionSchema],
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date,
    default: null
  },
  fileUrl: {
    type: String,
    default: null
  },
  fileName: {
    type: String,
    default: null
  },
  fileSize: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for performance
messageSchema.index({ roomId: 1, createdAt: -1 });
messageSchema.index({ userId: 1 });
messageSchema.index({ replyTo: 1 });

export const Message = model<IMessage>('Message', messageSchema);