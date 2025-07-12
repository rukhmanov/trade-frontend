import { Component } from '@angular/core';
import { IUser } from '../types';
import { jwtDecode } from 'jwt-decode';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserStateService } from 'src/app/state/user-state.service';
import { IonContent, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { BackButtonComponent } from '../../back-button/back-button.component';

@Component({
  selector: 'app-remote-login-target',
  templateUrl: './remote-login-target.component.html',
  styleUrls: ['./remote-login-target.component.scss'],
  imports: [
    IonToolbar,
    IonHeader,
    IonContent,
    IonToolbar,
    IonHeader,
    BackButtonComponent,
  ],
})
export class RemoteLoginTargetComponent {
  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public userState: UserStateService,
    public router: Router
  ) {
    this.authService
      .getAndSaveUserData(this.route.snapshot.queryParams['access_token'])
      .subscribe((data: IUser | any) => {
        userState.token$.next(data.data);
        userState.me$.next(jwtDecode(data.data));
        this.router.navigate(['tabs', 'settings']);
      });
  }
}
