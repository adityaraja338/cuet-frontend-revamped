import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminAuthService } from '../shared/auth/admin-auth.service';
import { GlobalService } from '../shared/services/global.service';
import { NavigationDirectionService } from '../shared/services/navigation-direction.service';
import { routeAnimations } from '../shared/animations/route.animations';

@Component({
  standalone: false,
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  animations: [routeAnimations],
})
export class AdminComponent {
  isCollapsed = false;
  isLogoutModal = false;

  constructor(
    private readonly authService: AdminAuthService,
    protected globalService: GlobalService,
    private navigationDirection: NavigationDirectionService,
  ) {}

  onClickLogout() {
    this.authService.logout();
  }

  getRouteState(outlet: RouterOutlet): string {
    return outlet?.isActivated
      ? this.navigationDirection.getDirection()
      : 'void';
  }
}
