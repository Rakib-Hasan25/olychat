import Redis from 'ioredis';

let redis: Redis | null = null;

// Only create Redis connection in runtime, not during build
// Check multiple conditions to ensure we're in the right environment
if (
  typeof window === 'undefined' && // Server-side only
  process.env.NODE_ENV !== 'test' && // Not in test environment
  process.env.NEXT_PHASE !== 'phase-production-build' // Not during build
) {
  try {
    redis = new Redis({
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
      host: process.env.REDIS_HOST || 'redis',
      stringNumbers: true,
      lazyConnect: true, // Don't connect immediately, connect when first command is issued
      connectTimeout: 10000,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
    });

    redis.on('error', (err) => {
      console.error('Redis connection error:', err.message);
      if (process.env.NODE_ENV === 'development') {
        console.log("Redis connection error details:", err);
      }
    });

    redis.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    redis.on('ready', () => {
      console.log('✅ Redis ready to accept commands');
    });

    redis.on('close', () => {
      console.warn('⚠️ Redis connection closed');
    });

  } catch (error) {
    console.error('Failed to create Redis client:', error);
    redis = null;
  }
}


export default redis;