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
    const accessToken = this.route.snapshot.queryParams['access_token'];
    
    if (accessToken) {
      // Используем новый метод для обработки токена
      this.authService.processYandexToken(accessToken).subscribe({
        next: (response) => {
          console.log('Authentication successful:', response);
        },
        error: (error) => {
          console.error('Authentication failed:', error);
          // В случае ошибки перенаправляем на страницу настроек
          this.router.navigate(['tabs', 'settings']);
        }
      });
    } else {
      console.error('No access token provided');
      this.router.navigate(['tabs', 'settings']);
    }
  }
}
