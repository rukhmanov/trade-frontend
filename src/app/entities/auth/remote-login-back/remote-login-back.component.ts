import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStateService } from 'src/app/state/user-state.service';
import { AuthService } from '../auth.service';
import { IYandexResponse, Platform } from '../types';
import { IonHeader, IonToolbar, IonContent } from '@ionic/angular/standalone';
import { BackButtonComponent } from '../../back-button/back-button.component';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-remote-login-back',
  templateUrl: './remote-login-back.component.html',
  styleUrls: ['./remote-login-back.component.scss'],
  imports: [IonContent, IonToolbar, IonHeader, BackButtonComponent],
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
      console.log('Yandex access token received:', fragment.access_token);
      
      // Отправляем токен на сервер и получаем JWT
      this.authService.processYandexToken(fragment.access_token).subscribe({
        next: (response) => {
          console.log('Authentication successful:', response);
        },
        error: (error) => {
          console.error('Authentication failed:', error);
          // В случае ошибки перенаправляем на страницу входа
          this.router.navigate(['tabs', 'settings']);
        }
      });
      return;
    }

    // Существующая логика для мобильных приложений
    const { value: platform } = await Preferences.get({ key: 'platform' });
    const { value: host } = await Preferences.get({ key: 'host' });
    const { value: service } = await Preferences.get({ key: 'service' });
    await Preferences.remove({ key: 'platform' });
    await Preferences.remove({ key: 'host' });
    await Preferences.remove({ key: 'service' });
    switch (platform) {
      case Platform.web:
        window.open(
          host +
            '/remote-login-target/' +
            `?service=${service}&access_token=${fragment.access_token}`,
          '_self'
        );
        break;
      case Platform.ios:
        break;
      case Platform.android:
        break;
    }
  }
}
