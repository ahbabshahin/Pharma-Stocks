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

  canActivate(): Observable<boolean> {
    return this.authService.getUser().pipe(
      map((user) => {
        if (user?.role === 'admin') {
          return true; // Grant access
        }
        this.router.navigate(['/not-authorized']); // Redirect if not admin
        return false;
      })
    );
  }
}
