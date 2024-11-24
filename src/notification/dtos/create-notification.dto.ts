export type LocationDTO = {
  latitude: number;
  longitude: number;
};

export type CreateNotificationDto = {
  userId: string;
  location: LocationDTO;
};
