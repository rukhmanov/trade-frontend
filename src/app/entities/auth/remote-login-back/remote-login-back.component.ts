import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStateService } from 'src/app/state/user-state.service';
import { AuthService } from '../auth.service';
import { IYandexResponse, Platform } from '../types';
import { IonHeader, IonToolbar, IonContent, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-remote-login-back',
  templateUrl: './remote-login-back.component.html',
  styleUrls: ['./remote-login-back.component.scss'],
  imports: [IonContent, IonToolbar, IonHeader, IonButtons, IonBackButton],
})
export class RemoteLoginBackComponent {
  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public userState: UserStateService,
    public router: Router
  ) {}

  async ngOnInit() {
    // Получаем токен из URL fragment (для веб-авторизации)
    const fragment: IYandexResponse = this.route.snapshot.fragment
      ?.split('&')
      .reduce((acc: any, cur: string) => {
        const item = cur.split('=');
        acc[item[0]] = item[1];
        return acc;
      }, {});

    // Если есть токен в fragment, обрабатываем его
    if (fragment?.access_token) {
      // Отправляем токен на сервер и получаем JWT
      this.authService.processYandexToken(fragment.access_token).subscribe({
        next: (response) => {
        },
        error: (error) => {
          console.error('Authentication failed:', error);
          // В случае ошибки перенаправляем на страницу входа
          this.router.navigate(['tabs', 'settings']);
        }
      });
      return;
    }
  }
}
