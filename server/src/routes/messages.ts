import express from 'express';
import { Message } from '../models/Message';
import { Room } from '../models/Room';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get messages for a room
router.get('/room/:roomId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { roomId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // Check if user has access to the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.type === 'private' && 
        !room.members.includes(req.user._id) && 
        room.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = await Message.find({ roomId })
      .populate('userId', 'username avatar')
      .populate('replyTo', 'content userId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalMessages = await Message.countDocuments({ roomId });

    res.json({
      success: true,
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        page,
        limit,
        total: totalMessages,
        pages: Math.ceil(totalMessages / limit)
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send message
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { roomId, content, type, replyTo, fileUrl, fileName, fileSize } = req.body;

    // Check if user has access to the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (!room.members.includes(req.user._id)) {
      return res.status(403).json({ error: 'You are not a member of this room' });
    }

    const message = new Message({
      roomId,
      userId: req.user._id,
      content,
      type: type || 'text',
      replyTo,
      fileUrl,
      fileName,
      fileSize
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('userId', 'username avatar')
      .populate('replyTo', 'content userId');

    res.status(201).json({ success: true, message: populatedMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Edit message
router.put('/:messageId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { content } = req.body;
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only edit your own messages' });
    }

    message.content = content;
    message.edited = true;
    message.editedAt = new Date();
    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('userId', 'username avatar')
      .populate('replyTo', 'content userId');

    res.json({ success: true, message: populatedMessage });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete message
router.delete('/:messageId', authenticate, async (req: AuthRequest, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own messages' });
    }

    await Message.findByIdAndDelete(req.params.messageId);

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add reaction to message
router.post('/:messageId/react', authenticate, async (req: AuthRequest, res) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      reaction => reaction.userId.toString() === req.user._id.toString() && 
                 reaction.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction
      message.reactions = message.reactions.filter(
        reaction => !(reaction.userId.toString() === req.user._id.toString() && 
                     reaction.emoji === emoji)
      );
    } else {
      // Add reaction
      message.reactions.push({
        userId: req.user._id,
        emoji,
        createdAt: new Date()
      });
    }

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('userId', 'username avatar')
      .populate('replyTo', 'content userId');

    res.json({ success: true, message: populatedMessage });
  } catch (error) {
    console.error('React to message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;