import { Controller, Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { NearbyLocations } from './dtos/nearby-locations.dto';

@Controller('notification')
export class NotificationController {
  private logger = new Logger(NotificationController.name);
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('send-notification')
  async sendNotification(
    @Payload() body: CreateNotificationDto,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.debug(
      `Received notification-order event: ${JSON.stringify(body)}`,
    );
    this.notificationService.addLocation(body);
    await channel.ack(originalMessage);
    try {
    } catch (err) {
      channel.ack(originalMessage);
    }
  }

  @EventPattern('get-nearby-users')
  async getNearby(
    @Payload() body: NearbyLocations,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      this.logger.debug(
        `Received notification-order event: ${JSON.stringify(body)}`,
      );
      const result = await this.notificationService.getNearbyUsers(body);
      await channel.ack(originalMessage);

      return result;
    } catch (err) {
      channel.ack(originalMessage);
    }
  }
}
