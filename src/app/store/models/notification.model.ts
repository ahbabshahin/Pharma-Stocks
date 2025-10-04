export interface Notification {
  _id: string;
  user: string;
  message: string;
  read: boolean;
}

export interface NotificationResponse {
  count: number;
  notifications: Notification[];
}
