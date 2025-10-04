import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { NotificationState } from '../../store/reducers/notification.reducer';
import * as notificationActions from '../../store/actions/notification.action';
import { Observable } from 'rxjs';
import * as notificationSelectors from '../../store/selectors/notification.selector';
import { Notification } from '../../store/models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationStoreService {
  constructor(private store: Store<NotificationState>) {}

  dispatch = (action: Action) => this.store.dispatch(action);
  select = (selector: any) => this.store.select(selector);

  loadNotifications() {
    this.dispatch(notificationActions.loadNotification());
  }

  markAsRead(id: string) {
    this.dispatch(notificationActions.markAsRead({ id }));
  }

  markAllAsRead() {
    this.dispatch(notificationActions.markAllAsRead());
  }

  // selector

  getTotalNotifications = (): Observable<number> =>
    this.select(notificationSelectors.getTotalNotifications);

  getNotificationError = (): Observable<string> =>
    this.select(notificationSelectors.getNotificationError);

  getNotifications = (): Observable<Notification[]> =>
    this.select(notificationSelectors.getNotifications);
}
