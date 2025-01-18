import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router'; // Import your auth service

@Injectable({
  providedIn: 'root',
})
export class LogoutGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('accessToken')
    if (token) {
      // Redirect to dashboard if the user is already logged in
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true; // Allow access if the user is not authenticated
  }
}
