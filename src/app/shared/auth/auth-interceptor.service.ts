import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { StudentAuthService } from './student-auth.service';
import { AdminAuthService } from './admin-auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null,
  );

  constructor(
    private studentAuthService: StudentAuthService,
    private adminAuthService: AdminAuthService,
    private message: NzMessageService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // console.log('intercepted');
    if (
      req.url.includes('/auth') ||
      req.url.includes('/register/create-order') ||
      req.url.includes('/register/payment-verify') ||
      req.url.includes('google.com') ||
      req.url.includes('razorpay.com')
    ) {
      return next.handle(req);
    }

    const isAdminRequest = req.url.includes('/admin/'); // Check if the request is for admin
    const authService = !isAdminRequest
      ? this.studentAuthService
      : this.adminAuthService;
    const accessToken = authService?.getAccessToken();

    // Clone the request to add the access token in the Authorization header
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
    });

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // If the access token is expired
        if (
          error.status === 401 &&
          !clonedReq.url.includes('/auth/refresh-token')
        ) {
          return this.handle401Error(clonedReq, next, authService);
        }
        return throwError(() => error);
      }),
    );
  }

  private addTokenToRequest(
    request: HttpRequest<any>,
    token: string,
  ): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler,
    authService: any,
  ) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null); // Reset refresh token subject

      return authService.refreshAccessToken().pipe(
        filter((token) => token != null), // Proceed only if token is available
        take(1),
        switchMap((response: any): any => {
          if (response?.status === 1 && response?.data?.accessToken != null) {
            const newAccessToken = response?.data?.accessToken;
            const newRefreshToken = response?.data?.refreshToken;
            const role = response?.data.role;

            // Update tokens in the token service
            authService.setTokens(newAccessToken, newRefreshToken, role);

            this.isRefreshing = false;
            this.refreshTokenSubject.next(newAccessToken);

            // Retry the failed request with the new access token
            return next.handle(this.addTokenToRequest(request, newAccessToken));
          }

          // Handle error if refresh fails
          this.isRefreshing = false;
          return this.handleRefreshTokenFailure(authService);
        }),
        catchError((error: any): any => {
          this.isRefreshing = false;
          return this.handleRefreshTokenFailure(authService);
        }),
      );
    } else {
      // Wait until the refresh token is resolved, then retry the original request
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) =>
          next.handle(this.addTokenToRequest(request, token)),
        ),
      );
    }
  }

  private handleRefreshTokenFailure(authService: any) {
    // Clear tokens and redirect to the login page
    this.message.error('Session expired! Please login again!');
    authService?.logout();
  }
}
