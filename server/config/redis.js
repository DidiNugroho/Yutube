require('dotenv').config()

const Redis = require('ioredis');

const redis = new Redis({
    host: 'redis-13705.c292.ap-southeast-1-1.ec2.redns.redis-cloud.com', 
    port: 13705, 
    password: process.env.REDIS_PASS,
});

redis.on('connect', () => {
    console.log('Connected to Redis!');
});

// Optional: Handle connection errors
redis.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = redis;