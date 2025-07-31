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
import { isPlatform } from '@ionic/angular/standalone';
import { registerPlugin } from '@capacitor/core';

import { initializeApp } from 'firebase/app';
import { 
  Auth, 
  getAuth, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
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
    
    // Слушатель состояния аутентификации Firebase
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('Firebase user is signed in:', user.email);
      } else {
        console.log('Firebase user is signed out');
      }
    });
    
    // Обработка результата redirect для нативных платформ
    if (Capacitor.isNativePlatform()) {
      this.handleRedirectResult();
    }
  }

  private async handleRedirectResult() {
    try {
      const result = await getRedirectResult(this.auth);
      if (result?.user) {
        // Получаем access token от Google через Firebase
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;
        
        if (!accessToken) {
          throw new Error('Failed to get access token from Google');
        }
        
        this.http
          .post<{ jwt: string }>(environment.base + 'users/google-auth/', {
            accessToken: accessToken,
          })
          .pipe(
            tap(({ jwt }) => {
              console.log('jwt from redirect ==> ', jwt);
              this.userState.token$.next(jwt);
              this.userState.me$.next(jwtDecode(jwt));
              this.userDataService.loadUserData();
              this.router.navigate(['tabs', 'all']);
            })
          )
          .subscribe({
            error: (error) => {
              console.error('Backend auth error from redirect:', error);
            }
          });
      }
    } catch (error: any) {
      console.error('Redirect result error:', error);
      // Проверяем, является ли ошибка отменой пользователя
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        console.log('User cancelled Google Sign In (redirect)');
      }
    }
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
    // Firebase Auth автоматически инициализируется при создании экземпляра
    console.log('Firebase Auth initialized');
  }

  async googleSignIn(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      let result;
      
      if (Capacitor.isNativePlatform()) {
        // Для нативных платформ используем redirect
        await signInWithRedirect(this.auth, provider);
        result = await getRedirectResult(this.auth);
      } else {
        // Для веб используем popup
        result = await signInWithPopup(this.auth, provider);
      }
      
      if (result?.user) {
        // Получаем access token от Google через Firebase
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;
        
        console.log('Google Sign In successful:', {
          user: result.user.email,
          accessToken: accessToken ? 'present' : 'missing'
        });
        
        if (!accessToken) {
          throw new Error('Failed to get access token from Google');
        }
        
        console.log('Sending access token to backend...');
        
        this.http
          .post<{ jwt: string }>(environment.base + 'users/google-auth/', {
            accessToken: accessToken,
          })
          .pipe(
            tap(({ jwt }) => {
              console.log('jwt ==> ', jwt);
              this.userState.token$.next(jwt);
              this.userState.me$.next(jwtDecode(jwt));
              this.userDataService.loadUserData(); // Загружаем данные пользователя
              this.router.navigate(['tabs', 'all']);
            })
          )
          .subscribe({
            error: (error) => {
              console.error('Backend auth error:', error);
              // Здесь можно добавить уведомление пользователю об ошибке
            }
          });
      } else {
        console.log('Google Sign In was cancelled by user');
      }
    } catch (error: any) {
      console.error('Google Sign In error:', error);
      // Проверяем, является ли ошибка отменой пользователя
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        console.log('User cancelled Google Sign In');
      } else {
        throw error;
      }
    }
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
          this.userDataService.loadUserData(); // Загружаем данные пользователя
          this.router.navigate(['tabs', 'all']);
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
}
