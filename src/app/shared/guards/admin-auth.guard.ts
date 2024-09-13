import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AdminAuthService } from '../auth/admin-auth.service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const adminAuthService = inject(AdminAuthService);
  return adminAuthService.isUserLoggedIn();
};
