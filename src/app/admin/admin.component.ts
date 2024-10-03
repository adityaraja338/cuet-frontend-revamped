import { Component } from '@angular/core';
import { AdminAuthService } from '../shared/auth/admin-auth.service';
import { GlobalService } from '../shared/services/global.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  isCollapsed = false;
  isLogoutModal = false;

  constructor(
    private readonly authService: AdminAuthService,
    protected globalService: GlobalService,
  ) {}

  onClickLogout() {
    this.authService.logout();
  }
}
