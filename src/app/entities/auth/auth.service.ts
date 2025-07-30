import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { IYandexResponse } from './types';
import { Platform } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';
import { UserStateService } from 'src/app/state/user-state.service';
import { DataStateService } from 'src/app/state/data-state.service';
import { ProductsApiService } from 'src/app/entities/cards/compact-card/services/cards-api.service';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { GoogleAuth, User } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular/standalone';
import { registerPlugin } from '@capacitor/core';

import { initializeApp } from 'firebase/app';
import { Auth, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  googleUser: any | null = null;
  baseUrl = environment.base;
  user: any | null = null;
  firebaseApp = initializeApp(environment.firebase);
  private auth: Auth = getAuth(this.firebaseApp);
  YandexLogin: any = registerPlugin('YandexLoginPlugin');

  constructor(
    private http: HttpClient,
    public userState: UserStateService,
    private dataStateService: DataStateService,
    private productsApiService: ProductsApiService,
    public router: Router,
    private platform: Platform
  ) {
    initializeApp(environment.firebase);
    this.initializeGoogleAuth();
  }

  async yandexLogin() {
    console.log('yandexLogin ==> ', Capacitor.isNativePlatform());
    if (Capacitor.isNativePlatform()) {
      Browser.open({
        url:
          'https://oauth.yandex.ru/authorize?response_type=token&client_id=' +
          environment.yandexClientId,
      });
    } else {
      window.open(
        'https://oauth.yandex.ru/authorize?response_type=token&client_id=' +
          environment.yandexClientId,
        '_self'
      );
    }
  }

  authYandex(body: IYandexResponse): Observable<any> {
    return this.http.post(environment.base + 'oauth/ya', body);
  }

  getAndSaveUserData(accessToken: string): any {
    return this.http.post(environment.base + 'users/auth/', {
      accessToken,
    });
  }

  logout() {
    this.userState.me$.next(null);
    this.userState.token$.next(null);
    localStorage.removeItem('token');
    
    // Очищаем данные пользователя при выходе
    this.dataStateService.likedProducts$.next(null);
    this.dataStateService.cardsInMyCart$.next(null);
    this.dataStateService.myCards$.next(null);
  }

  initializeGoogleAuth() {
    if (!isPlatform('capacitor')) {
      GoogleAuth.initialize();
    }
    this.platform.ready().then(() => {
      console.log('platform ==> ');
      GoogleAuth.initialize();
    });
  }

  async googleSignIn() {
    const googleUser = await GoogleAuth.signIn();
    const googleAccessToken = googleUser?.authentication?.accessToken;
    return this.http
      .post<{ jwt: string }>(environment.base + 'users/google-auth/', {
        accessToken: googleAccessToken,
      })
      .pipe(
        tap(({ jwt }) => {
          console.log('jwt ==> ', jwt);
          this.userState.token$.next(jwt);
          this.userState.me$.next(jwtDecode(jwt));
          this.loadUserData(); // Загружаем данные пользователя
          this.router.navigate(['tabs', 'tab1']);
        })
      )
      .subscribe();
  }

  async yandexSignIn() {
    try {
      const result = await this.YandexLogin.login();
      const yandexAccessToken = result.accessToken;
      return this.http
        .post<{ jwt: string }>(environment.base + 'users/auth/', {
          accessToken: yandexAccessToken,
        })
        .pipe(
          tap(({ jwt }) => {
            this.userState.token$.next(jwt);
            this.userState.me$.next(jwtDecode(jwt));
            this.loadUserData(); // Загружаем данные пользователя
            this.router.navigate(['tabs', 'tab1']);
          })
        )
        .subscribe();
    } catch (e) {
      console.error('Yandex login error', e);
      return null;
    }
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password).then(
      (userCredential) => {
        // You can handle user information here if needed
        const user = userCredential.user;
        console.log('User logged in:', user);
      }
    );
  }

  private loadUserData() {
    // Данные загружаются автоматически в UserStateService при установке токена
    // Этот метод оставлен для совместимости
  }
}
