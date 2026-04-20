import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminHttpService } from '../services/admin-http.service';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  // isLogin = false;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // Expose the subject as an observable for external components
  isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  constructor(
    private router: Router,
    private message: NzMessageService,
    private http: AdminHttpService,
  ) {}

  isUserLoggedIn() {
    if (
      localStorage.getItem('cuet_access_token') &&
      localStorage.getItem('cuet_refresh_token') &&
      localStorage.getItem('cuet_role') === 'admin'
    ) {
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    this.isAuthenticatedSubject.next(false);
    return false;
  }

  getAccessToken() {
    return localStorage.getItem('cuet_access_token');
  }

  getRefreshToken() {
    return localStorage.getItem('cuet_refresh_token');
  }

  setTokens(accessToken: string, refreshToken: string, role: string) {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('role', role);
    localStorage.setItem('cuet_access_token', accessToken);
    localStorage.setItem('cuet_refresh_token', refreshToken);
    localStorage.setItem('cuet_role', role);
  }

  clearTokens() {
    localStorage?.removeItem('cuet_access_token');
    localStorage?.removeItem('cuet_refresh_token');
    localStorage?.removeItem('cuet_role');
  }

  refreshAccessToken() {
    return this.http.refreshAccessToken({
      refreshToken: this.getRefreshToken(),
    });
  }

  login() {
    const isAuthenticated = true;
    this.isAuthenticatedSubject.next(isAuthenticated);
    this.router.navigate(['/', 'admin', 'home']);
  }

  logout() {
    this.clearTokens();
    this.message.success('Successful! User logged out!');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login'], { state: { back: true } });
    // this.message.success('User logged out!');
  }
}
