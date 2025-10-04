import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzListModule } from 'ng-zorro-antd/list';
import { NotificationStoreService } from '../../service/notification/notification-store.service';
import { Observable, of } from 'rxjs';
import { Notification } from '../../store/models/notification.model';
import { LoaderComponent } from '../loader/loader.component';
import { NoDataComponent } from '../no-data/no-data.component';

@Component({
  standalone: true,
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  imports: [
    CommonModule,
    NzListModule,
    NoDataComponent,
  ],
})
export class NotificationComponent {
  notifications$: Observable<Notification[]> = of([]);

  constructor(private notificationStore: NotificationStoreService){}

  ngOnInit(){
    this.initialize();
  }

  initialize(){
    this.getNotifications();
  }

  refresh(){
    this.notificationStore.loadNotifications();
  }

  getNotifications(){
    const { getNotifications } = this.notificationStore;

    this.notifications$ = getNotifications();
  }

  ngOnDestroy(){}
}
