import { Injectable } from '@angular/core';
import { AuthStoreService } from './auth-store.service';
import { Router } from '@angular/router';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private authStore: AuthStoreService,
    private router: Router,
    private commonService: CommonService
  ) {}

  executeLogout() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('role');
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      this.authStore.logout();
      this.router.navigate(['/auth']);
    } else this.commonService.showErrorToast('Logout failed');
  }
}
