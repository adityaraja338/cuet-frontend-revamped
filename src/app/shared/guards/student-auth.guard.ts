import { CanActivateFn } from '@angular/router';

export const studentAuthGuard: CanActivateFn = (route, state) => {
  return true;
};
