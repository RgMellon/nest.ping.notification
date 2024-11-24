import { Global, Module } from '@nestjs/common';
import * as Redis from 'ioredis';
import * as georedis from 'georedis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: () => {
        const redisClient = new Redis.default({
          host: 'localhost', // Host do Redis
          port: 6379, // Porta padrão do Redis
        });

        const geo = georedis.initialize(redisClient);

        return geo;
      },
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
