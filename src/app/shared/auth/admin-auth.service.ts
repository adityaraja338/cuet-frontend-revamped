import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

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

  login() {
    const isAuthenticated = true;
    this.isAuthenticatedSubject.next(isAuthenticated);
    this.router.navigate(['/', 'admin', 'home']);
  }

  logout() {
    localStorage.removeItem('cuet_access_token');
    localStorage.removeItem('cuet_refresh_token');
    localStorage.removeItem('cuet_role');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
    // this.message.success('User logged out!');
  }
}
