import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpService } from '../services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StudentAuthService } from './student-auth.service';
import { googleAuthConfig } from '../config/google-auth.config';
import { GlobalService } from '../services/global.service';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  userLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(
    private oauthService: OAuthService,
    private http: HttpService,
    private message: NzMessageService,
    private studentAuthService: StudentAuthService,
    private globalService: GlobalService,
  ) {}

  configureOAuth() {
    this.oauthService.configure(googleAuthConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  loginWithGoogle() {
    // This will redirect the user to Google for login
    this.oauthService.initLoginFlow();
  }

  getUserData() {
    const claims = this.oauthService.getIdentityClaims();
    if (claims) {
      const userData = {
        idToken: this.oauthService.getIdToken(),
        accessToken: this.oauthService.getAccessToken(),
        user: claims,
      };
      // console.log('userData', userData);
      this.http.postStudentGoogleLogin(userData).subscribe({
        next: (res: any) => {
          // console.log(res?.data);
          if (res?.data?.userExists === true) {
            localStorage.setItem('cuet_access_token', res.data.accessToken);
            localStorage.setItem('cuet_refresh_token', res.data.refreshToken);
            localStorage.setItem('cuet_role', res.data.role);
            this.studentAuthService.login();
          } else {
            // User does not exist, return the response to display a registration form
            this.globalService.setData(res?.data);
            this.globalService.toggleRegistrationPage();
          }
        },
        error: (error: any) => {
          console.log(error);
          this.message.error('Login failed. Please try again.');
        },
      });
    }
  }

  handleLogin() {
    this.oauthService.tryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        return this.getUserData();
      }
    });
  }
}
