import { CanActivateFn } from '@angular/router';
import { StudentAuthService } from '../auth/student-auth.service';
import { inject } from '@angular/core';

export const studentAuthGuard: CanActivateFn = (route, state) => {
  const studentAuthService = inject(StudentAuthService);
  return studentAuthService.isUserLoggedIn();
};
