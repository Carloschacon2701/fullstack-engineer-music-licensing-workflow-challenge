import { Cache } from '@nestjs/cache-manager';
import type { RedisClientType } from '@redis/client';

export const cacheRemover = async (cacheKey: string, cacheManager: Cache) => {
  const cache = await cacheManager.get(cacheKey);
  if (cache) {
    await cacheManager.del(cacheKey);
  }
};

export const deleteCacheByPattern = async (
  pattern: string,
  redisClient: RedisClientType | null,
  cacheManager: Cache,
): Promise<void> => {
  if (!redisClient) {
    // Fallback: if no Redis client, try to delete the base key
    await cacheManager.del(pattern.replace('*', ''));
    return;
  }

  try {
    // Use SCAN to find keys matching the pattern
    const keys: string[] = [];
    let cursor = '0';

    do {
      const result = await redisClient.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });
      cursor = result.cursor;
      keys.push(...result.keys);
    } while (cursor !== '0');

    // Delete all matching keys
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch {
    // Fallback: if pattern deletion fails, at least try to delete the base key
    await cacheManager.del(pattern.replace('*', ''));
  }
};
