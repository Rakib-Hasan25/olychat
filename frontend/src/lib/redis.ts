import Redis from 'ioredis';

const redis = new Redis({
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  host: process.env.REDIS_HOST? process.env.REDIS_HOST: 'host.docker.internal',
  stringNumbers: true
});

export default redis;