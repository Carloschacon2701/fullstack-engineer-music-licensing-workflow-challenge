import { Cache } from '@nestjs/cache-manager';

export const cacheRemover = async (cacheKey: string, cacheManager: Cache) => {
  const cache = await cacheManager.get(cacheKey);
  if (cache) {
    await cacheManager.del(cacheKey);
  }
};
