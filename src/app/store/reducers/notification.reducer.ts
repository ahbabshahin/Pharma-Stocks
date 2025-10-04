import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Notification } from '../models/notification.model';
import { createReducer, on } from '@ngrx/store';
import * as notificationActions from '../actions/notification.action';

export interface NotificationState extends EntityState<Notification> {
  total: number;
  error: string;
}

const defaultNotification: NotificationState = {
  ids: [],
  entities: {},
  total: 0,
  error: '',
};

export const notificationAdapter: EntityAdapter<Notification> =
  createEntityAdapter<Notification>({
    selectId: (notification: Notification) => notification?._id as string,
  });

const initialState: NotificationState =
  notificationAdapter.getInitialState(defaultNotification);

export const notificationReducer = createReducer(
  initialState,
  on(notificationActions.loadNotification, (state) => {
    return {
      ...state,
    };
  }),
  on(notificationActions.loadNotificationSuccess, (state, action) => {
    return notificationAdapter.setAll(action.res?.notifications, {
      ...state,
      total: action.res?.count,
      error: '',
    });
  }),
  on(notificationActions.loadNotificationFail, (state, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(notificationActions.markAllAsReadSuccess, (state) =>{
    return {
      ...state,
      total: 0,
      error: ''
    }
  }),
  on(notificationActions.markAllAsReadFail, (state, action) =>{
     return {
       ...state,
       error: action.error,
     };
  })
);
