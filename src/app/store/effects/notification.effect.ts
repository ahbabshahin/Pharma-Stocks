import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationApiService } from '../../service/notification/notification-api.service';
import * as notificationActions from '../actions/notification.action';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { NotificationResponse } from '../models/notification.model';
import { CommonService } from '../../service/common/common.service';

@Injectable()
export class NotificationEffects {
  constructor(
    private actions$: Actions,
    private notificationApi: NotificationApiService,
    private commonService: CommonService,
  ) {}

  loadNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationActions.loadNotification),
      exhaustMap(() => {
        return this.notificationApi.getNotifications().pipe(
          map((res: NotificationResponse) => {
            let unread = res?.notifications?.filter((item) => !item?.read);
            let response: NotificationResponse = {
              notifications: res?.notifications,
              count: unread?.length,
            }
            return notificationActions.loadNotificationSuccess({ res: response });
          }),
          catchError((err) => {
            let errMsg = err || 'Load notification failed';

            return of(
              notificationActions.loadNotificationFail({ error: errMsg })
            );
          })
        );
      })
    )
  );

  markAllAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationActions.markAllAsRead),
      exhaustMap(() => {
        return this.notificationApi.markAllAsRead().pipe(
          map(() => {
            this.commonService.dismissLoading();
            this.commonService.showSuccessToast('Mark all as read successful');
            return notificationActions.markAllAsReadSuccess();
          }),
          catchError((err) => {
            let errMsg = err || 'Mark all as read failed';
            this.commonService.dismissLoading();
            this.commonService.showErrorToast(errMsg)
            return of(
              notificationActions.markAllAsReadFail({ error: errMsg })
            );
          })
        );
      })
    )
  );
}
