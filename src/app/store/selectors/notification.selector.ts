import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  notificationAdapter,
  NotificationState,
} from '../reducers/notification.reducer';
import { notificationStateName } from '../app.state';

export const getNotificationState = createFeatureSelector<NotificationState>(
  notificationStateName
);

export const getTotalNotifications = createSelector(
  getNotificationState,
  (state: NotificationState) => state.total
);

export const getNotificationError = createSelector(
  getNotificationState,
  (state: NotificationState) => state.error
);

export const getNotifications = createSelector(
  getNotificationState,
  notificationAdapter.getSelectors().selectAll
);
