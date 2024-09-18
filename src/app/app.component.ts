import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { GoogleAuthService } from './shared/auth/google-auth.service';
import { AdminAuthService } from './shared/auth/admin-auth.service';
import { StudentAuthService } from './shared/auth/student-auth.service';
import { filter } from 'rxjs/operators';
import { GlobalService } from './shared/services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private googleAuthService: GoogleAuthService,
    private adminAuthService: AdminAuthService,
    private studentAuthService: StudentAuthService,
    private globalService: GlobalService,
    private router: Router,
  ) {
    this.googleAuthService.configureOAuth();
  }
  // isCollapsed = false;
  ngOnInit(): void {
    if (
      !this.studentAuthService.isUserLoggedIn() &&
      !this.adminAuthService.isUserLoggedIn()
    ) {
      this.googleAuthService.handleLogin();
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.globalService.getMe();
      });
  }
}
