import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, Service } from '../types';
import { AuthService } from '../auth.service';
import { BackButtonComponent } from '../../back-button/back-button.component';
import { IonHeader, IonToolbar, IonContent } from '@ionic/angular/standalone';
import { Preferences } from '@capacitor/preferences';

/**
 * с этой страницы начинается авторизация
 */
@Component({
  selector: 'app-remote-login',
  templateUrl: './remote-login.component.html',
  styleUrls: ['./remote-login.component.scss'],
  imports: [IonContent, IonToolbar, IonHeader, BackButtonComponent],
})
export class RemoteLoginComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const params = this.route.snapshot?.queryParams;
    const { platform, service, host } = params;
    if (platform in Platform && service in Service) {
      await Preferences.set({ key: 'platform', value: platform });
      await Preferences.set({ key: 'service', value: service });
      await Preferences.set({ key: 'host', value: decodeURIComponent(host) });
      switch (platform) {
        case Platform.web:
          if (service === Service.yandex) {
            this.authService.yandexLogin();
          } else if (service === Service.google) {
          }
          break;
        case Platform.ios:
          this.authService.yandexLogin();
          break;
        case Platform.android:
          break;
      }
    } else {
      this.router.navigate(['/']);
    }
  }
}
//http://localhost:8100/remote-login?platform=web&service=yandex&token=123
