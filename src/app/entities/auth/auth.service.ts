import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mergeMap, Observable, tap } from 'rxjs';
import { IYandexResponse } from './types';
import { environment } from 'src/environments/environment';
import { UserStateService } from 'src/app/state/user-state.service';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

import { initializeApp } from 'firebase/app';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
  UserCredential,
  User,
} from 'firebase/auth';
import { jwtDecode } from 'jwt-decode';
import { InAppBrowser } from '@capacitor/inappbrowser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  googleUser: any | null = null;
  baseUrl = environment.base;
  verifier = '';
  challenge = '';
  user: any | null = null;
  firebaseApp = initializeApp(environment.firebase);
  private auth: Auth = getAuth(this.firebaseApp);

  constructor(
    private http: HttpClient,
    public userState: UserStateService,
    public router: Router
  ) {
    initializeApp(environment.firebase);
  }

  async yandexLogin() {
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
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result: UserCredential = await signInWithPopup(this.auth, provider);
    const googleUser: User | any = (result as any)['_tokenResponse'];
    const googleAccessToken = googleUser['oauthAccessToken'];

    return this.http
      .post<{ jwt: string }>(environment.base + 'users/google-auth/', {
        accessToken: googleAccessToken,
      })
      .pipe(
        tap(({ jwt }) => {
          this.userState.token$.next(jwt);
          this.userState.me$.next(jwtDecode(jwt));
          this.router.navigate(['tabs', 'all']);
        })
      )
      .subscribe();
  }
}
