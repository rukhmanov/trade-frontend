import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserStateService } from '../state/user-state.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userStateService = inject(UserStateService);
  if (!userStateService.me$.value) {
    return false;
  } else {
    return true;
  }
};
