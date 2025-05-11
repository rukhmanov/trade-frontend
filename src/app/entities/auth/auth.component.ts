import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { UserStateService } from 'src/app/state/user-state.service';
import {
  IonButton,
  IonText,
  IonIcon,
  IonChip,
  IonAvatar,
  IonLabel,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { Platform, Service } from './types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    IonLabel,
    IonAvatar,
    IonChip,
    IonIcon,
    IonText,
    IonButton,
    CommonModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  constructor(
    public authService: AuthService,
    public router: Router,
    public userState: UserStateService
  ) {}

  loginYandex(): void {
    const platform: Platform = Capacitor.getPlatform() as Platform;
    switch (platform) {
      case Platform.web:
        this.router.navigate(['remote-login'], {
          queryParams: { platform: Platform.web, service: Service.yandex },
        });
        break;
      case Platform.ios:
        break;
      case Platform.android:
        break;
    }
    // this.authService.yandexLogin();
  }

  loginGoogle(): void {
    window.open('http://localhost:4200/remote-login/123');
    // this.authService.signInWithGoogle();
  }
}
