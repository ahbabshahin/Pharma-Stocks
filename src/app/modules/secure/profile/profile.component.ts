import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { SharedModule } from '../../../shared/shared.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthStoreService } from '../../../service/auth/auth-store.service';
import { CommonService } from '../../../service/common/common.service';
import { Router } from '@angular/router';
import { User } from '../../../store/models/user.model';
import { SubSink } from 'subsink';
import { CommonComponentModule } from "../../../common-component/common-component.module";
import { LoaderComponent } from "../../../common-component/loader/loader.component";
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule, CommonComponentModule, LoaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  subs = new SubSink();
  loader: boolean = true;
  user!: User;
  constructor(
    private authStore: AuthStoreService,
    private commonService: CommonService,
    private router: Router,
    private authService: AuthService,
  ){}

  ngOnInit(){
    this.initialize();
  }

  initialize(){
    this.getUser();
  }

  getUser(){
    this.subs.sink = this.authStore.getUser().subscribe({
      next: (res: User) => {
        this.user = res;
        this.loader = false;
      },
      error: () => {
        this.commonService.showErrorModal('No user found');
        this.loader = false;
        this.authService.executeLogout();
      },
    });
  }

  async logout(){
    const ok = await this.commonService.showConfirmModal('Are you sure you want to logout?');
    console.log('ok: ', ok);
    if(!ok) return;
    this.authService.executeLogout();
  }

  executeLogout(){
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('role');
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      this.authStore.logout()
      this.router.navigate(['/auth']);
    } else this.commonService.showErrorToast('Logout failed');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
