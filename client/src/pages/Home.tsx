import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Home: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-dark-900 dark:to-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to{' '}
              <span className="text-primary-600 dark:text-primary-400">
                Yeettalk
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              🎵 Web Server Phòng Trò Chuyện Voice Chat + Screen Sharing + Music
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Connect with friends through voice chat, share your screen, listen to music together, 
              and enjoy real-time conversations in a modern, responsive interface.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn-primary text-lg px-8 py-4 rounded-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary text-lg px-8 py-4 rounded-lg"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary text-lg px-8 py-4 rounded-lg"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="bg-primary-100 dark:bg-primary-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              🎤
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Voice Chat
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Crystal clear voice communication with WebRTC technology
            </p>
          </div>

          <div className="text-center">
            <div className="bg-secondary-100 dark:bg-secondary-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              💬
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Text Chat
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Real-time messaging with emoji support and file sharing
            </p>
          </div>

          <div className="text-center">
            <div className="bg-accent-100 dark:bg-accent-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              🎵
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Music Sharing
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Listen to music together with synchronized playback
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-100 dark:bg-primary-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              📺
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Screen Share
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Share your screen or watch presentations together
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;