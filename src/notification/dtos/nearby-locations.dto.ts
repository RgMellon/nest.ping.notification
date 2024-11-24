import { LocationDTO } from './create-notification.dto';

export type NearbyLocations = {
  radius: number;
  location: LocationDTO;
};
