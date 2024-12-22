import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  // Mock function to check if the user is authenticated
  private isAuthenticated(): boolean {
    // Replace with your actual authentication logic
    const token = sessionStorage.getItem('accessToken'); // Example using localStorage
    return !!token; // Return true if a token exists, otherwise false
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> {
    if (this.isAuthenticated()) {
      return true; // Allow access
    } else {
      // Redirect to the login page if not authenticated
      return this.router.createUrlTree(['/auth'], {
        queryParams: { returnUrl: state.url }, // Optionally save the requested URL
      });
    }
  }
}
