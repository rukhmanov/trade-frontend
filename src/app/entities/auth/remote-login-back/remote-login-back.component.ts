import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserStateService } from 'src/app/state/user-state.service';
import { AuthService } from '../auth.service';
import { IUser, IYandexResponse, Platform } from '../types';
import { IonHeader, IonToolbar, IonContent } from '@ionic/angular/standalone';
import { BackButtonComponent } from '../../back-button/back-button.component';

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
  ) {
    console.log('this.route.snapshot ==> ', this.route.snapshot);
    const fragment: IYandexResponse = this.route.snapshot.fragment
      ?.split('&')
      .reduce((acc: any, cur: string) => {
        const item = cur.split('=');
        acc[item[0]] = item[1];
        return acc;
      }, {});

    const platform = localStorage.getItem('platform');
    const host = localStorage.getItem('host');
    const service = localStorage.getItem('service');
    localStorage.removeItem('platform');
    localStorage.removeItem('host');
    localStorage.removeItem('service');
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
