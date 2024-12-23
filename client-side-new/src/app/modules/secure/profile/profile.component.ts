import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { SharedModule } from '../../../shared/shared.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthStoreService } from '../../../service/auth/auth-store.service';
import { CommonService } from '../../../service/common/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {

  constructor(
    private authStore: AuthStoreService,
    private commonService: CommonService,
    private router: Router,
  ){}

  ngOnInit(){}

  async logout(){
    const ok = await this.commonService.showConfirmModal('Are you sure you want to logout?');
    console.log('ok: ', ok);
    if(!ok) return;

    // this.commonService.presentLoading();
    // this.authStore.logout();
    sessionStorage.removeItem('accessToken');
    const token = sessionStorage.getItem('accessToken');
    if(!token) {
      this.router.navigate(['/auth']);
    }else this.commonService.showErrorToast('Logout failed')
  }

  ngOnDestroy() {}
}
