import { Component } from '@angular/core';
import { AdminAuthService } from '../shared/auth/admin-auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  isCollapsed = false;
  isLogoutModal = false;

  constructor(private readonly authService: AdminAuthService) {}

  onClickLogout() {
    this.authService.logout();
  }
}
