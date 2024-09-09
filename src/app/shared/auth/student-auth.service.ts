import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

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
  ) {}

  isUserLoggedIn() {
    if (
      localStorage.getItem('cuet_access_token') &&
      localStorage.getItem('cuet_refresh_token')
    ) {
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    this.isAuthenticatedSubject.next(false);
    this.logout();
    return false;
  }

  login() {
    const isAuthenticated = true;
    this.isAuthenticatedSubject.next(isAuthenticated);
    sessionStorage.clear();
    this.router.navigate(['/', 'student', 'home']);
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
