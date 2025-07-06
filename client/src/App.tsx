import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import { useRoomStore } from './store/roomStore';
import { socketService } from './services/socket';
import { SOCKET_EVENTS } from '../../shared';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Room from './pages/Room';

// Components
import { LoadingSpinner } from './components/Common/LoadingSpinner';
import { Notifications } from './components/Common/Notifications';

const queryClient = new QueryClient();

function App() {
  const { user, token, loading, checkAuth } = useAuthStore();
  const { addMessage, updateMessage, addTypingUser, removeTypingUser } = useRoomStore();

  useEffect(() => {
    // Check authentication on app start
    if (token) {
      checkAuth();
    }
  }, [token, checkAuth]);

  useEffect(() => {
    if (!token || !user) return;

    // Setup socket event listeners
    const setupSocketListeners = () => {
      socketService.on(SOCKET_EVENTS.NEW_MESSAGE, (message) => {
        addMessage(message);
      });

      socketService.on(SOCKET_EVENTS.MESSAGE_EDITED, (message) => {
        updateMessage(message._id, message);
      });

      socketService.on(SOCKET_EVENTS.USER_TYPING, (data) => {
        if (data.isTyping) {
          addTypingUser(data.userId);
        } else {
          removeTypingUser(data.userId);
        }
      });

      socketService.on(SOCKET_EVENTS.ERROR, (error) => {
        console.error('Socket error:', error);
      });
    };

    setupSocketListeners();

    return () => {
      // Cleanup socket listeners
      socketService.off(SOCKET_EVENTS.NEW_MESSAGE);
      socketService.off(SOCKET_EVENTS.MESSAGE_EDITED);
      socketService.off(SOCKET_EVENTS.USER_TYPING);
      socketService.off(SOCKET_EVENTS.ERROR);
    };
  }, [token, user, addMessage, updateMessage, addTypingUser, removeTypingUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" /> : <Register />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/room/:roomId" 
              element={user ? <Room /> : <Navigate to="/login" />} 
            />
          </Routes>
          <Notifications />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
