import { Component } from '@angular/core';
import { GlobalService } from '../shared/services/global.service';
import { StudentAuthService } from '../shared/auth/student-auth.service';

@Component({
  standalone: false,
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
})
export class StudentComponent {
  isCollapsed = false;
  isLogoutModal = false;

  constructor(
    protected globalService: GlobalService,
    private authService: StudentAuthService,
  ) {}

  onClickLogout() {
    this.authService.logout();
  }
}
