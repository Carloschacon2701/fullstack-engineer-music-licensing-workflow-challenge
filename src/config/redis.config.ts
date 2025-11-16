import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 1000 }),
            }),
            new KeyvRedis(process.env.REDIS_URL),
          ],
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class RedisConfigModule {}

// Keep the old export for backward compatibility if needed
export const redisConfig = RedisConfigModule;
