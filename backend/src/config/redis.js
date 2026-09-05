import { createClient } from "redis";

let redisClient = null;

export const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    console.warn(
      "Redis cache disabled: REDIS_URL is missing"
    );

    return null;
  }

  const client = createClient({
    url: process.env.REDIS_URL,
    socket: {
      connectTimeout: 10000,
      reconnectStrategy: (retries) => {
        if (retries > 3) {
          return new Error(
            "Redis reconnect limit reached"
          );
        }

        return Math.min(retries * 200, 1000);
      },
    },
  });

  client.on("error", (error) => {
    console.error("Redis client error:", error.message);
  });

  try {
    await client.connect();
    redisClient = client;

    console.log("Redis connected successfully");

    return redisClient;
  } catch (error) {
    redisClient = null;

    console.warn(
      `Redis connection failed; continuing without cache: ${error.message}`
    );

    return null;
  }
};

export const getRedisClient = () => {
  if (!redisClient?.isReady) {
    return null;
  }

  return redisClient;
};

export const disconnectRedis = async () => {
  if (redisClient?.isOpen) {
    await redisClient.quit();
  }
};