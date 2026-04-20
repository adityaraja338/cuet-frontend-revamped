import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalService } from '../shared/services/global.service';
import { StudentAuthService } from '../shared/auth/student-auth.service';
import { NavigationDirectionService } from '../shared/services/navigation-direction.service';
import { routeAnimations } from '../shared/animations/route.animations';

@Component({
  standalone: false,
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
  animations: [routeAnimations],
})
export class StudentComponent {
  isCollapsed = false;
  isLogoutModal = false;

  constructor(
    protected globalService: GlobalService,
    private authService: StudentAuthService,
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
