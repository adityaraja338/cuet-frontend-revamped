import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { GoogleAuthService } from './shared/auth/google-auth.service';
import { AdminAuthService } from './shared/auth/admin-auth.service';
import { StudentAuthService } from './shared/auth/student-auth.service';
import { filter } from 'rxjs/operators';
import { GlobalService } from './shared/services/global.service';
import { NavigationDirectionService } from './shared/services/navigation-direction.service';
import { routeAnimations } from './shared/animations/route.animations';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations],
})
export class AppComponent implements OnInit {
  constructor(
    private googleAuthService: GoogleAuthService,
    private adminAuthService: AdminAuthService,
    private studentAuthService: StudentAuthService,
    private globalService: GlobalService,
    private router: Router,
    private navigationDirection: NavigationDirectionService,
  ) {
    this.googleAuthService.configureOAuth();
  }

  getRouteState(outlet: RouterOutlet): string {
    return outlet?.isActivated
      ? this.navigationDirection.getDirection()
      : 'void';
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
