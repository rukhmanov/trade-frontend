import { Component, OnInit } from '@angular/core';
import { IUser, IYandexResponse, Platform } from '../types';
import { jwtDecode } from 'jwt-decode';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserStateService } from 'src/app/state/user-state.service';

@Component({
  selector: 'app-remote-login-target',
  templateUrl: './remote-login-target.component.html',
  styleUrls: ['./remote-login-target.component.scss'],
})
export class RemoteLoginTargetComponent {
  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public userState: UserStateService,
    public router: Router
  ) {
    const fragment = this.route.snapshot.fragment
      ?.split('&')
      .reduce((acc: any, cur: string) => {
        const item = cur.split('=');
        acc[item[0]] = item[1];
        return acc;
      }, {});

    this.authService
      .getAndSaveUserData(fragment.access_token)
      .subscribe((data: IUser | any) => {
        userState.token$.next(data.data);
        userState.me$.next(jwtDecode(data.data));
      });
  }
}
