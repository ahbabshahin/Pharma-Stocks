import { createAction, props } from '@ngrx/store';
import { Notification, NotificationResponse } from '../models/notification.model';
import { Update } from '@ngrx/entity';

export const loadNotification = createAction(
  '[Notification] load notification'
);
export const loadNotificationSuccess = createAction(
  '[Notification] load notification success',
  props<{ res: NotificationResponse }>()
);
export const loadNotificationFail = createAction(
  '[Notification] load notification fail',
  props<{ error: string }>()
);

export const markAsRead = createAction(
  '[Notification] mark as Read',
  props<{id: string}>()
);
export const markAsReadSuccess = createAction(
  '[Notification] mark as Read success',
  props<{ res: Update<Notification> }>()
);
export const markAsReadFail = createAction(
  '[Notification] mark as Read fail',
  props<{ error: string }>()
);

export const markAllAsRead = createAction(
  '[Notification] mark all as Read'
);
export const markAllAsReadSuccess = createAction(
  '[Notification] mark all as Read success',
);
export const markAllAsReadFail = createAction(
  '[Notification] mark all as Read fail',
  props<{ error: string }>()
);
