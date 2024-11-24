import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { NearbyLocations } from './dtos/nearby-locations.dto';

@Injectable()
export class NotificationService {
  private logger = new Logger(NotificationService.name);

  constructor(@Inject('REDIS') private readonly geoRedis) {}

  async addLocation({
    location,
    userId,
  }: CreateNotificationDto): Promise<void> {
    const locations = this.geoRedis.addSet('locations');

    this.logger.debug(
      `Adding location for user ${userId}: (${location.latitude}, ${location.longitude})`,
    );

    return new Promise((resolve, reject) => {
      locations.addLocation(
        userId,
        { latitude: location.latitude, longitude: location.longitude },
        (err, reply) => {
          if (err) {
            return reject(err);
          }

          this.logger.log(
            `Location added for user ${userId} successfully ${reply}`,
          );
          resolve(reply);
        },
      );
    });
  }

  async getNearbyUsers({
    location,
    radius = 1000,
  }: NearbyLocations): Promise<string[]> {
    this.logger.debug(
      `Getting nearby users within radius ${radius} from location (${location.latitude}, ${location.longitude})`,
    );

    const locations = this.geoRedis.addSet('locations');

    return new Promise((resolve, reject) => {
      locations.nearby(
        { latitude: location.latitude, longitude: location.longitude },
        radius,
        { withCoordinates: true },
        (err, users) => {
          if (err) {
            this.logger.error(`Error fetching nearby users: ${err}`);
            return reject(err);
          }

          this.logger.log(`Fetching users: ${JSON.stringify(users)}`);

          resolve(users);
        },
      );
    });
  }
}
