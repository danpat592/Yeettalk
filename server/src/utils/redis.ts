import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient>;

export const connectRedis = async (): Promise<void> => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 60000
      }
    });
    
    redisClient.on('error', (error) => {
      console.error('Redis connection error:', error);
    });
    
    redisClient.on('connect', () => {
      console.log('📡 Redis connected successfully');
    });
    
    redisClient.on('reconnecting', () => {
      console.log('Redis reconnecting...');
    });
    
    redisClient.on('ready', () => {
      console.log('Redis ready for use');
    });
    
    await redisClient.connect();
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await redisClient.quit();
        console.log('Redis connection closed through app termination');
      } catch (error) {
        console.error('Error closing Redis connection:', error);
      }
    });
    
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    // Don't exit process for Redis connection failure
    console.log('Continuing without Redis...');
  }
};

export const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

export const isRedisConnected = () => {
  return redisClient && redisClient.isReady;
};