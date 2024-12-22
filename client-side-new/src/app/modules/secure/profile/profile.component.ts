import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { SharedModule } from '../../../shared/shared.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthStoreService } from '../../../service/auth/auth-store.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {

  constructor(private authStore: AuthStoreService){}

  ngOnInit(){}

  async logout(){
    this.authStore.logout();
  }

  ngOnDestroy() {}
}
