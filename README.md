# Yeettalk 🎵
**Web Server Phòng Trò Chuyện Voice Chat + Screen Sharing + Music**

A modern, full-featured chat application with real-time voice communication, screen sharing, and music streaming capabilities.

## ✨ Features

- 🎤 **Voice Chat**: WebRTC-based peer-to-peer voice communication
- 💬 **Real-time Text Chat**: Socket.io powered messaging with emoji support
- 📺 **Screen Sharing**: Share your screen or applications with room members
- 🎵 **Music Streaming**: Listen to music together with synchronized playback
- 📱 **Mobile Responsive**: Progressive Web App with touch-friendly interface
- 🔐 **Secure Authentication**: JWT-based authentication with refresh tokens
- 🌙 **Dark Mode Support**: Beautiful light and dark themes

## 🏗️ Architecture

```
yeettalk/
├── client/          # React 18 + TypeScript + Vite frontend
├── server/          # Node.js + Express + TypeScript backend
├── shared/          # Shared types and utilities
└── docs/           # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- Redis (optional, for enhanced session management)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/danpat592/Yeettalk.git
   cd Yeettalk
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment template
   cp .env.example server/.env
   
   # Edit server/.env with your configuration
   # At minimum, set MONGODB_URI for database connection
   ```

4. **Start development servers**
   ```bash
   # Start both client and server
   npm run dev
   
   # Or start individually:
   npm run dev:server  # Backend on http://localhost:3001
   npm run dev:client  # Frontend on http://localhost:5173
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Create an account and start chatting!

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Socket.io Client** for real-time communication
- **Zustand** for state management
- **React Router** for navigation
- **React Query** for server state
- **WebRTC APIs** for voice and video

### Backend
- **Node.js** with Express and TypeScript
- **Socket.io** for real-time events
- **MongoDB** with Mongoose for data storage
- **Redis** for session management (optional)
- **JWT** for authentication
- **bcrypt** for password hashing
- **WebRTC signaling** server

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

### Room Management
- `GET /api/rooms/public` - Get public rooms
- `GET /api/rooms/my-rooms` - Get user's rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms/:id/join` - Join room
- `POST /api/rooms/:id/leave` - Leave room

### Messaging
- `GET /api/messages/room/:roomId` - Get room messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id` - Edit message
- `DELETE /api/messages/:id` - Delete message
- `POST /api/messages/:id/react` - Add/remove reaction

## 🔧 Development

### Available Scripts

```bash
# Root scripts
npm run dev              # Start both client and server
npm run build           # Build both applications
npm run test            # Run all tests
npm run install:all     # Install all dependencies

# Client scripts
npm run dev:client      # Start React development server
npm run build:client    # Build React application
npm run test:client     # Run client tests

# Server scripts
npm run dev:server      # Start Express development server
npm run build:server    # Build Express application
npm run test:server     # Run server tests
```

### Database Setup

1. **MongoDB** (Required)
   ```bash
   # Using MongoDB Atlas (cloud)
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yeettalk
   
   # Using local MongoDB
   MONGODB_URI=mongodb://localhost:27017/yeettalk
   ```

2. **Redis** (Optional, but recommended for production)
   ```bash
   # Local Redis
   REDIS_URL=redis://localhost:6379
   
   # Redis Cloud
   REDIS_URL=redis://username:password@host:port
   ```

## 🌐 Socket.io Events

### Room Events
- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `user_joined_room` - User joined notification
- `user_left_room` - User left notification

### Message Events
- `send_message` - Send a message
- `new_message` - Receive new message
- `typing_start` - User started typing
- `typing_stop` - User stopped typing

### Voice Events
- `voice_offer` - WebRTC offer for voice chat
- `voice_answer` - WebRTC answer for voice chat
- `voice_ice_candidate` - ICE candidate exchange

### Screen Share Events
- `screen_share_start` - Start screen sharing
- `screen_share_stop` - Stop screen sharing
- `screen_share_offer` - WebRTC offer for screen share

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] User authentication
- [x] Real-time text chat
- [x] Room management
- [x] Basic responsive design

### Phase 2: Multimedia (In Progress)
- [ ] Voice chat implementation
- [ ] Screen sharing implementation
- [ ] File upload and sharing
- [ ] Music streaming

### Phase 3: Enhanced Features
- [ ] PWA implementation
- [ ] Push notifications
- [ ] Advanced voice features (noise suppression)
- [ ] Music equalizer
- [ ] Video chat
- [ ] Mobile app versions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- WebRTC for real-time communication
- Socket.io for WebSocket management
- React team for the amazing framework
- Tailwind CSS for beautiful styling
- MongoDB for database solutions

---

**Built with ❤️ by danpat592**
