import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  // Mock function to retrieve the token (replace with your actual token retrieval logic)
  private getToken(): string | null {
    return localStorage.getItem('jwtToken'); //
    // Assume token is stored in localStorage
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.getToken();

    // Clone the request to add custom headers
    let authReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    // Pass the modified request to the next handler
    return next.handle(authReq);
  }
}
