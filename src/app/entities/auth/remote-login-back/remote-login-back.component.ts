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
  access_token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public userState: UserStateService,
    public router: Router
  ) {
    const fragment: IYandexResponse = this.route.snapshot.fragment
      ?.split('&')
      .reduce((acc: any, cur: string) => {
        const item = cur.split('=');
        acc[item[0]] = item[1];
        return acc;
      }, {});

    this.access_token = fragment.access_token;
    this.authService
      .getAndSaveUserData(fragment.access_token)
      .subscribe((data: IUser | any) => {
        const platform = localStorage.getItem('platform');
        userState.token$.next(data.data);
        userState.me$.next(jwtDecode(data.data));
        localStorage.removeItem('platform');
        localStorage.removeItem('service');
        switch (platform) {
          case Platform.web:
            this.router.navigate(['tabs', 'all']);
            break;
          case Platform.ios:
            break;
          case Platform.android:
            break;
        }
      });
  }
}
