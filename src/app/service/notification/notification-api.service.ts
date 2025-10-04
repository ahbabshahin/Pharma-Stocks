import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../../config';
import { map, Observable } from 'rxjs';
import {
  Notification,
  NotificationResponse,
} from '../../store/models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationApiService {
  constructor(private http: HttpClient, private env: Config) {}

  getNotifications(): Observable<NotificationResponse> {
    return this.http
      .get<NotificationResponse>(`${this.env.rootURL}/v1/notification`)
      .pipe(map((res: NotificationResponse) => res));
  }

  markAsRead(id: string): Observable<Notification> {
    return this.http
      .get<Notification>(`${this.env.rootURL}/v1/notification/${id}`)
      .pipe(map((res: any) => res?.notification));
  }

  markAllAsRead() {
    return this.http.get(`${this.env.rootURL}/v1/notification/mark-all`);
  }
}
