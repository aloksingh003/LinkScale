import { getRedisClient } from "../config/redis.js";

export const getCachedValue = async (key) => {
  const redisClient = getRedisClient();

  if (!redisClient) {
    return null;
  }

  try {
    return await redisClient.get(key);
  } catch (error) {
    console.warn(
      `Redis GET failed; using database: ${error.message}`
    );

    return null;
  }
};

export const setCachedValue = async (
  key,
  value,
  ttlSeconds
) => {
  const redisClient = getRedisClient();

  if (!redisClient) {
    return false;
  }

  try {
    await redisClient.set(key, value, {
      EX: ttlSeconds,
    });

    return true;
  } catch (error) {
    console.warn(
      `Redis SET failed; continuing without cache: ${error.message}`
    );

    return false;
  }
};

export const deleteCachedValue = async (key) => {
  const redisClient = getRedisClient();

  if (!redisClient) {
    return false;
  }

  try {
    await redisClient.del(key);

    return true;
  } catch (error) {
    console.warn(
      `Redis DELETE failed; cache will expire automatically: ${error.message}`
    );

    return false;
  }
};