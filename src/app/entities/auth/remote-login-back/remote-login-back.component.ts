import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserStateService } from 'src/app/state/user-state.service';
import { AuthService } from '../auth.service';
import { IUser, IYandexResponse, Platform } from '../types';

@Component({
  selector: 'app-remote-login-back',
  templateUrl: './remote-login-back.component.html',
  styleUrls: ['./remote-login-back.component.scss'],
})
export class RemoteLoginBackComponent {
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

    this.authService
      .getAndSaveUserData(fragment.access_token)
      .subscribe((data: IUser | any) => {
        const platform = localStorage.getItem('platform');
        userState.token$.next(data.data);
        userState.me$.next(jwtDecode(data.data));
        switch (platform) {
          case Platform.ios:
            break;
          case Platform.android:
            break;
        }
        localStorage.removeItem('platform');
        localStorage.removeItem('service');
        this.router.navigate(['tabs', 'all']);
      });
  }
}
