import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';// Adjust path as needed
import { map } from 'rxjs/operators';
import { AuthStoreService } from '../service/auth/auth-store.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthStoreService, private router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('accessToken');
    const role = sessionStorage.getItem('role');

    if (token && role === 'admin') {
      // Allow access if token exists and role is admin
      return true;
    } else {
      // Redirect to login or unauthorized page
      // this.router.navigate(['/unauthorized']);
      this.router.navigate(['/not-authorized']); // Redirect if not admin
      return false;
    }
  }
}
