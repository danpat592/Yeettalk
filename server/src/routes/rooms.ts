import express from 'express';
import { Room } from '../models/Room';
import { User } from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all public rooms
router.get('/public', async (req, res) => {
  try {
    const rooms = await Room.find({ type: 'public', isActive: true })
      .populate('ownerId', 'username avatar')
      .populate('members', 'username avatar isOnline')
      .sort({ createdAt: -1 });

    res.json({ success: true, rooms });
  } catch (error) {
    console.error('Get public rooms error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's rooms
router.get('/my-rooms', authenticate, async (req: AuthRequest, res) => {
  try {
    const rooms = await Room.find({ 
      $or: [
        { ownerId: req.user._id },
        { members: req.user._id }
      ]
    })
      .populate('ownerId', 'username avatar')
      .populate('members', 'username avatar isOnline')
      .sort({ updatedAt: -1 });

    res.json({ success: true, rooms });
  } catch (error) {
    console.error('Get user rooms error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get room by ID
router.get('/:roomId', authenticate, async (req: AuthRequest, res) => {
  try {
    const room = await Room.findById(req.params.roomId)
      .populate('ownerId', 'username avatar')
      .populate('members', 'username avatar isOnline');

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if user has access to the room
    if (room.type === 'private' && 
        !room.members.includes(req.user._id) && 
        room.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ success: true, room });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create room
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, description, type, maxMembers, settings } = req.body;

    const room = new Room({
      name,
      description,
      type,
      ownerId: req.user._id,
      members: [req.user._id],
      maxMembers,
      settings
    });

    await room.save();
    
    // Add room to user's rooms
    await User.findByIdAndUpdate(req.user._id, {
      $push: { rooms: room._id }
    });

    const populatedRoom = await Room.findById(room._id)
      .populate('ownerId', 'username avatar')
      .populate('members', 'username avatar isOnline');

    res.status(201).json({ success: true, room: populatedRoom });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Join room
router.post('/:roomId/join', authenticate, async (req: AuthRequest, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (!room.isActive) {
      return res.status(400).json({ error: 'Room is not active' });
    }

    if (room.members.includes(req.user._id)) {
      return res.status(400).json({ error: 'Already a member of this room' });
    }

    if (room.members.length >= room.maxMembers) {
      return res.status(400).json({ error: 'Room is full' });
    }

    // Add user to room
    room.members.push(req.user._id);
    await room.save();

    // Add room to user's rooms
    await User.findByIdAndUpdate(req.user._id, {
      $push: { rooms: room._id }
    });

    const populatedRoom = await Room.findById(room._id)
      .populate('ownerId', 'username avatar')
      .populate('members', 'username avatar isOnline');

    res.json({ success: true, room: populatedRoom });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Leave room
router.post('/:roomId/leave', authenticate, async (req: AuthRequest, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (!room.members.includes(req.user._id)) {
      return res.status(400).json({ error: 'Not a member of this room' });
    }

    // Remove user from room
    room.members = room.members.filter(
      member => member.toString() !== req.user._id.toString()
    );
    await room.save();

    // Remove room from user's rooms
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { rooms: room._id }
    });

    res.json({ success: true, message: 'Left room successfully' });
  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update room (owner only)
router.put('/:roomId', authenticate, async (req: AuthRequest, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only room owner can update the room' });
    }

    const { name, description, maxMembers, settings } = req.body;

    if (name) room.name = name;
    if (description !== undefined) room.description = description;
    if (maxMembers) room.maxMembers = maxMembers;
    if (settings) room.settings = { ...room.settings, ...settings };

    await room.save();

    const populatedRoom = await Room.findById(room._id)
      .populate('ownerId', 'username avatar')
      .populate('members', 'username avatar isOnline');

    res.json({ success: true, room: populatedRoom });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete room (owner only)
router.delete('/:roomId', authenticate, async (req: AuthRequest, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only room owner can delete the room' });
    }

    // Remove room from all users
    await User.updateMany(
      { rooms: room._id },
      { $pull: { rooms: room._id } }
    );

    await Room.findByIdAndDelete(req.params.roomId);

    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;