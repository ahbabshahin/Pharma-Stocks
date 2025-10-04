import { CommonModule } from '@angular/common';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NotificationStoreService } from '../../service/notification/notification-store.service';
import { NotificationComponent } from '../notification/notification.component';
import { Observable, of } from 'rxjs';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { CommonService } from '../../service/common/common.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  imports: [CommonModule, RouterModule, NzButtonModule, NzIconModule, NzBadgeModule],
})
export class NavBarComponent {
  constructor(
    private drawerService: NzDrawerService,
    private notificationStore: NotificationStoreService,
    private commonService: CommonService,
  ) {}
  total$: Observable<number> = of(0);
  interval: any;

  @ViewChild('notificationFooter', { static: true })
  notificationFooter!: TemplateRef<any>;

  @ViewChild('markAllBtn', { static: false })
  markAllBtn!: ElementRef<HTMLButtonElement>;

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.syncNotification();
    this.loadNotification();
    this.getTotalNotifications();
  }

  loadNotification(){
    this.notificationStore.loadNotifications();
  }

  getTotalNotifications(){
    const { getTotalNotifications } = this.notificationStore;
    this.total$ = getTotalNotifications();
  }

  syncNotification(){
    const durations = 30 * 60 * 1000;
    this.interval = setInterval(() => {
      this.loadNotification();
    }, durations);
  }

  async sidebar() {
    const { SidebarComponent } = await import('../sidebar/sidebar.component');
    this.drawerService.create({
      nzClosable: true,
      nzMaskClosable: false,
      nzWrapClassName: 'md-drawer',
      // nzSize: 'large',
      nzContent: SidebarComponent,
    });
  }

  async notifications() {
    const { NotificationComponent } = await import(
      '../notification/notification.component'
    );
    this.drawerService.create({
      nzTitle: 'Notifications',
      nzClosable: true,
      nzMaskClosable: false,
      nzWrapClassName: 'md-drawer',
      nzContent: NotificationComponent,
      nzFooter: this.notificationFooter,
    });
  }

  markAllAsRead(){
    this.commonService.presentLoading();
    this.notificationStore.markAllAsRead();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
