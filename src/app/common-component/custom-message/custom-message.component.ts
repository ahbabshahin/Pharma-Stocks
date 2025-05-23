import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {
  NzNotificationComponent,
  NzNotificationService,
} from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-custom-message',
  standalone: true,
  imports: [],
  templateUrl: './custom-message.component.html',
  styleUrl: './custom-message.component.scss',
})
export class CustomMessageComponent {
  @ViewChild('notificationBtnTpl', { static: true }) btnTemplate!: TemplateRef<{
    $implicit: NzNotificationComponent;
  }>;
  constructor(private notification: NzNotificationService) {}

  createNotification(): void {
    this.notification.blank(
      'Notification Title',
      'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
      {
        nzButton: this.btnTemplate,
      }
    );
  }
}
