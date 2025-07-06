import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Room } from '../models/Room';
import { Message } from '../models/Message';
import { SOCKET_EVENTS } from '../../../shared';

interface AuthSocket extends Socket {
  userId?: string;
  user?: any;
}

export const setupSocketHandlers = (io: Server) => {
  // Authentication middleware
  io.use(async (socket: AuthSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      const user = await User.findById(decoded.id).select('-password -refreshToken');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    console.log(`User ${socket.user.username} connected`);

    // Update user online status
    User.findByIdAndUpdate(socket.userId, { 
      isOnline: true, 
      lastSeen: new Date() 
    }).exec();

    // Handle room joining
    socket.on(SOCKET_EVENTS.JOIN_ROOM, async (roomId: string) => {
      try {
        const room = await Room.findById(roomId);
        if (!room) {
          socket.emit(SOCKET_EVENTS.ROOM_ERROR, { error: 'Room not found' });
          return;
        }

        if (!room.members.includes(socket.userId!)) {
          socket.emit(SOCKET_EVENTS.ROOM_ERROR, { error: 'Not a member of this room' });
          return;
        }

        socket.join(roomId);
        socket.emit(SOCKET_EVENTS.ROOM_JOINED, { roomId });
        
        // Notify other room members
        socket.to(roomId).emit(SOCKET_EVENTS.USER_JOINED_ROOM, {
          userId: socket.userId,
          username: socket.user.username,
          avatar: socket.user.avatar
        });

        console.log(`User ${socket.user.username} joined room ${roomId}`);
      } catch (error) {
        socket.emit(SOCKET_EVENTS.ROOM_ERROR, { error: 'Failed to join room' });
      }
    });

    // Handle room leaving
    socket.on(SOCKET_EVENTS.LEAVE_ROOM, (roomId: string) => {
      socket.leave(roomId);
      socket.emit(SOCKET_EVENTS.ROOM_LEFT, { roomId });
      
      // Notify other room members
      socket.to(roomId).emit(SOCKET_EVENTS.USER_LEFT_ROOM, {
        userId: socket.userId,
        username: socket.user.username
      });

      console.log(`User ${socket.user.username} left room ${roomId}`);
    });

    // Handle message sending
    socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data: any) => {
      try {
        const { roomId, content, type = 'text', replyTo } = data;

        // Verify user is in room
        const room = await Room.findById(roomId);
        if (!room || !room.members.includes(socket.userId!)) {
          socket.emit(SOCKET_EVENTS.MESSAGE_ERROR, { error: 'Not authorized to send message' });
          return;
        }

        // Create message
        const message = new Message({
          roomId,
          userId: socket.userId,
          content,
          type,
          replyTo
        });

        await message.save();

        const populatedMessage = await Message.findById(message._id)
          .populate('userId', 'username avatar')
          .populate('replyTo', 'content userId');

        // Emit to room
        io.to(roomId).emit(SOCKET_EVENTS.NEW_MESSAGE, populatedMessage);

        console.log(`Message sent in room ${roomId} by ${socket.user.username}`);
      } catch (error) {
        socket.emit(SOCKET_EVENTS.MESSAGE_ERROR, { error: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on(SOCKET_EVENTS.TYPING_START, (data: any) => {
      const { roomId } = data;
      socket.to(roomId).emit(SOCKET_EVENTS.USER_TYPING, {
        userId: socket.userId,
        username: socket.user.username,
        isTyping: true
      });
    });

    socket.on(SOCKET_EVENTS.TYPING_STOP, (data: any) => {
      const { roomId } = data;
      socket.to(roomId).emit(SOCKET_EVENTS.USER_TYPING, {
        userId: socket.userId,
        username: socket.user.username,
        isTyping: false
      });
    });

    // Handle WebRTC signaling for voice chat
    socket.on(SOCKET_EVENTS.VOICE_OFFER, (data: any) => {
      const { roomId, targetUserId, sdp } = data;
      socket.to(roomId).emit(SOCKET_EVENTS.VOICE_OFFER, {
        fromUserId: socket.userId,
        targetUserId,
        sdp
      });
    });

    socket.on(SOCKET_EVENTS.VOICE_ANSWER, (data: any) => {
      const { roomId, targetUserId, sdp } = data;
      socket.to(roomId).emit(SOCKET_EVENTS.VOICE_ANSWER, {
        fromUserId: socket.userId,
        targetUserId,
        sdp
      });
    });

    socket.on(SOCKET_EVENTS.VOICE_ICE_CANDIDATE, (data: any) => {
      const { roomId, targetUserId, candidate } = data;
      socket.to(roomId).emit(SOCKET_EVENTS.VOICE_ICE_CANDIDATE, {
        fromUserId: socket.userId,
        targetUserId,
        candidate
      });
    });

    // Handle voice state changes
    socket.on(SOCKET_EVENTS.VOICE_STATE_CHANGED, (data: any) => {
      const { roomId, isMuted, isSpeaking } = data;
      socket.to(roomId).emit(SOCKET_EVENTS.VOICE_STATE_CHANGED, {
        userId: socket.userId,
        username: socket.user.username,
        isMuted,
        isSpeaking
      });
    });

    // Handle screen sharing
    socket.on(SOCKET_EVENTS.SCREEN_SHARE_START, (data: any) => {
      const { roomId } = data;
      socket.to(roomId).emit(SOCKET_EVENTS.SCREEN_SHARE_START, {
        userId: socket.userId,
        username: socket.user.username
      });
    });

    socket.on(SOCKET_EVENTS.SCREEN_SHARE_STOP, (data: any) => {
      const { roomId } = data;
      socket.to(roomId).emit(SOCKET_EVENTS.SCREEN_SHARE_STOP, {
        userId: socket.userId,
        username: socket.user.username
      });
    });

    // Handle WebRTC signaling for screen sharing
    socket.on(SOCKET_EVENTS.SCREEN_SHARE_OFFER, (data: any) => {
      const { roomId, targetUserId, sdp } = data;
      socket.to(roomId).emit(SOCKET_EVENTS.SCREEN_SHARE_OFFER, {
        fromUserId: socket.userId,
        targetUserId,
        sdp
      });
    });

    socket.on(SOCKET_EVENTS.SCREEN_SHARE_ANSWER, (data: any) => {
      const { roomId, targetUserId, sdp } = data;
      socket.to(roomId).emit(SOCKET_EVENTS.SCREEN_SHARE_ANSWER, {
        fromUserId: socket.userId,
        targetUserId,
        sdp
      });
    });

    socket.on(SOCKET_EVENTS.SCREEN_SHARE_ICE_CANDIDATE, (data: any) => {
      const { roomId, targetUserId, candidate } = data;
      socket.to(roomId).emit(SOCKET_EVENTS.SCREEN_SHARE_ICE_CANDIDATE, {
        fromUserId: socket.userId,
        targetUserId,
        candidate
      });
    });

    // Handle music controls
    socket.on(SOCKET_EVENTS.MUSIC_PLAY, (data: any) => {
      const { roomId } = data;
      socket.to(roomId).emit(SOCKET_EVENTS.MUSIC_PLAY, {
        userId: socket.userId,
        username: socket.user.username,
        ...data
      });
    });

    socket.on(SOCKET_EVENTS.MUSIC_PAUSE, (data: any) => {
      const { roomId } = data;
      socket.to(roomId).emit(SOCKET_EVENTS.MUSIC_PAUSE, {
        userId: socket.userId,
        username: socket.user.username,
        ...data
      });
    });

    socket.on(SOCKET_EVENTS.MUSIC_NEXT, (data: any) => {
      const { roomId } = data;
      socket.to(roomId).emit(SOCKET_EVENTS.MUSIC_NEXT, {
        userId: socket.userId,
        username: socket.user.username,
        ...data
      });
    });

    socket.on(SOCKET_EVENTS.MUSIC_SEEK, (data: any) => {
      const { roomId } = data;
      socket.to(roomId).emit(SOCKET_EVENTS.MUSIC_SEEK, {
        userId: socket.userId,
        username: socket.user.username,
        ...data
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.username} disconnected`);
      
      // Update user offline status
      User.findByIdAndUpdate(socket.userId, { 
        isOnline: false, 
        lastSeen: new Date() 
      }).exec();

      // Notify all rooms that user went offline
      socket.rooms.forEach(room => {
        if (room !== socket.id) {
          socket.to(room).emit(SOCKET_EVENTS.USER_OFFLINE, {
            userId: socket.userId,
            username: socket.user.username
          });
        }
      });
    });
  });
};