import { Component, OnInit } from '@angular/core';
import { IUser } from '../types';
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
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.router.navigate(['tabs', 'settings']);
    } else {
      this.authService
        .getAndSaveUserData(token)
        .subscribe((data: IUser | any) => {
          userState.token$.next(data.data);
          userState.me$.next(jwtDecode(data.data));
          this.router.navigate(['tabs', 'all']);
        });
    }
  }
}
