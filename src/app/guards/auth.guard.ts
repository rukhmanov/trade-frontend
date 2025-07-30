import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserStateService } from '../state/user-state.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private userState: UserStateService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.userState.me$.pipe(
      map(user => {
        if (user) {
          return true; // Пользователь авторизован
        } else {
          // Перенаправляем на страницу настроек, где есть кнопка входа
          this.router.navigate(['/tabs/settings']);
          return false;
        }
      })
    );
  }
} 