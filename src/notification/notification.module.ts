import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RedisModule } from 'src/redis/redis.module';
import { NotificationController } from './notification.controller';

@Module({
  imports: [RedisModule],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
