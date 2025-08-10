import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
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
import { GoogleAuthService } from './google-auth.service';

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
    private platform: Platform,
    private googleAuthService: GoogleAuthService
  ) {
    initializeApp(environment.firebase);
    this.initializeGoogleAuth();
  }

  async yandexSignIn() {
    console.log('yandexLogin ==> ', Capacitor.isNativePlatform());
    
    // Создаем callback URL
    const callbackUrl = this.getCallbackUrl();
    const authUrl = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${environment.yandexClientId}&redirect_uri=${encodeURIComponent(callbackUrl)}`;
    
    if (Capacitor.isNativePlatform()) {
      // Для iOS открываем браузер с callback URL
      await Browser.open({
        url: authUrl,
        windowName: '_self'
      });
    } else {
      // Для веба используем стандартный подход
      window.open(authUrl, '_self');
    }
  }

  private getCallbackUrl(): string {
    // Создаем callback URL для возврата в приложение
    if (Capacitor.isNativePlatform()) {
      // Для iOS используем веб-URL с параметром платформы
      // Это позволит Яндексу корректно перенаправить
      return window.location.origin + '/auth/callback?platform=ios';
    } else {
      // Для веба используем текущий URL с callback маршрутом
      return window.location.origin + '/auth/callback';
    }
  }

  // Метод для обработки токена от Яндекса и отправки на сервер
  processYandexToken(accessToken: string): Observable<any> {
    console.log('🔍 Processing Yandex token:', accessToken);
    console.log('🔍 API endpoint:', environment.base + 'users/auth/');
    
    return this.http
      .post<{ status: string; data: string }>(environment.base + 'users/auth/', {
        accessToken: accessToken,
      })
      .pipe(
        tap((response) => {
          console.log('🔍 Yandex auth response:', response);
          const jwt = response.data;
          // Очищаем данные предыдущего пользователя
          this.clearUserData();
          
          this.userState.token$.next(jwt);
          this.userState.me$.next(jwtDecode(jwt));
          // Принудительно обновляем данные пользователя при входе
          this.userDataService.forceRefreshUserData().subscribe(() => {
            this.router.navigate(['tabs', 'all']);
          });
        }),
        catchError((error: any) => {
          console.error('🔍 Error processing Yandex token:', error);
          throw error;
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
    // Инициализируем Google Auth только один раз
    try {
      if (isPlatform('capacitor')) {
        // Для мобильных платформ
        this.platform.ready().then(() => {
          console.log('Initializing Google Auth for Capacitor');
          GoogleAuth.initialize();
        });
      } else {
        // Для веб-платформы
        console.log('Initializing Google Auth for Web');
        // Добавляем небольшую задержку для веб-платформы
        setTimeout(() => {
          try {
            GoogleAuth.initialize();
          } catch (initError) {
            console.error('Error initializing Google Auth for Web:', initError);
            // Попробуем еще раз через большее время
            setTimeout(() => {
              try {
                GoogleAuth.initialize();
              } catch (retryError) {
                console.error('Retry failed for Google Auth initialization:', retryError);
              }
            }, 500);
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error in initializeGoogleAuth:', error);
    }
  }

  async googleSignIn() {
    try {
      // Убеждаемся, что Google Auth инициализирован
      if (isPlatform('capacitor')) {
        await this.platform.ready();
      } else {
        // Для веб-платформы убеждаемся, что инициализация завершена
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Попробуем инициализировать еще раз перед входом
      try {
        GoogleAuth.initialize();
      } catch (initError) {
        console.log('Google Auth already initialized or initialization failed:', initError);
      }
      
      const googleUser = await GoogleAuth.signIn();
      console.log("🔍 ~ googleSignIn ~ parsifal/src/app/entities/auth/auth.service.ts:106 ~ googleUser:", googleUser);
      const googleAccessToken = googleUser?.authentication?.accessToken;
      
      if (!googleAccessToken) {
        throw new Error('Не удалось получить токен доступа от Google');
      }
      
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
    } catch (error) {
      console.error('Ошибка при входе через Google:', error);
      throw error;
    }
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
