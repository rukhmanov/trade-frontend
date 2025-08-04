import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { IYandexResponse } from './types';
import { Platform } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';
import { UserStateService } from 'src/app/state/user-state.service';
import { DataStateService } from 'src/app/state/data-state.service';
import { UserDataService } from 'src/app/services/user-data.service';
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
    private userDataService: UserDataService,
    public router: Router,
    private platform: Platform
  ) {
    initializeApp(environment.firebase);
    this.initializeGoogleAuth();
  }

  async yandexSignIn() {
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

  // Метод для обработки токена от Яндекса и отправки на сервер
  processYandexToken(accessToken: string): Observable<any> {
    return this.http
      .post<{ status: string; data: string }>(environment.base + 'users/auth/', {
        accessToken: accessToken,
      })
      .pipe(
        tap((response) => {
          const jwt = response.data;
          // Очищаем данные предыдущего пользователя
          this.clearUserData();
          
          this.userState.token$.next(jwt);
          this.userState.me$.next(jwtDecode(jwt));
          // Принудительно обновляем данные пользователя при входе
          this.userDataService.forceRefreshUserData().subscribe(() => {
            this.router.navigate(['tabs', 'all']);
          });
        })
      );
  }

  getAndSaveUserData(accessToken: string): Observable<any> {
    return this.http.post<{ status: string; data: string }>(environment.base + 'users/auth/', {
      accessToken,
    }).pipe(
      tap((response) => {
        const jwt = response.data;
        // Очищаем данные предыдущего пользователя
        this.clearUserData();
        
        this.userState.token$.next(jwt);
        this.userState.me$.next(jwtDecode(jwt));
        // Принудительно обновляем данные пользователя
        this.userDataService.forceRefreshUserData().subscribe();
      })
    );
  }

  logout() {
    this.userState.me$.next(null);
    this.userState.token$.next(null);
    localStorage.removeItem('token');
    
    // Очищаем данные пользователя при выходе
    this.dataStateService.likedProducts$.next(null);
    this.dataStateService.cardsInMyCart$.next(null);
    this.dataStateService.myCards$.next(null);
    
    // Очищаем кеш данных
    this.dataStateService.clearCache();
  }

  // Метод для очистки данных при смене пользователя
  clearUserData() {
    this.dataStateService.likedProducts$.next(null);
    this.dataStateService.cardsInMyCart$.next(null);
    this.dataStateService.myCards$.next(null);
    this.dataStateService.clearCache();
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
    console.log("🔍 ~ googleSignIn ~ parsifal/src/app/entities/auth/auth.service.ts:106 ~ googleUser:", googleUser);
    const googleAccessToken = googleUser?.authentication?.accessToken;
    return this.http
      .post<{ jwt: string }>(environment.base + 'users/google-auth/', {
        accessToken: googleAccessToken,
      })
      .pipe(
        tap((response) => {
          const jwt = response.jwt;
          // Очищаем данные предыдущего пользователя
          this.clearUserData();
          
          this.userState.token$.next(jwt);
          this.userState.me$.next(jwtDecode(jwt));
          // Принудительно обновляем данные пользователя при входе
          this.userDataService.forceRefreshUserData().subscribe(() => {
            this.router.navigate(['tabs', 'all']);
          });
        })
      )
      .subscribe();
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password).then(
      (userCredential) => {
        // You can handle user information here if needed
        const user = userCredential.user;
        console.log('User logged in:', user);
        
        // Очищаем данные предыдущего пользователя
        this.clearUserData();
        
        // Принудительно обновляем данные пользователя
        this.userDataService.forceRefreshUserData().subscribe();
      }
    );
  }
}
