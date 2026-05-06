import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';

@Injectable({
  providedIn: 'root',
})
export class StudentAuthService {
  // isLogin = false;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // Expose the subject as an observable for external components
  isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  constructor(
    private router: Router,
    private message: NzMessageService,
    private http: HttpService,
  ) {}

  isUserLoggedIn() {
    if (
      localStorage.getItem('cuet_access_token') &&
      localStorage.getItem('cuet_refresh_token') &&
      localStorage.getItem('cuet_role') === 'student'
    ) {
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    this.isAuthenticatedSubject.next(false);
    // this.logout();
    return false;
  }

  getAccessToken() {
    return localStorage.getItem('cuet_access_token');
  }

  getRefreshToken() {
    return localStorage.getItem('cuet_refresh_token');
  }

  setTokens(accessToken: string, refreshToken: string, role: string) {
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
    sessionStorage.clear();
    this.router.navigate(['/', 'student', 'home']);
  }

  logout() {
    localStorage.clear();
    this.message.success('Successful! Student logged out!');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }
}
