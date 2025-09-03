import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, from, map, Observable, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataStateService } from 'src/app/state/data-state.service';
import { UserStateService } from 'src/app/state/user-state.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'auth-token';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  baseUrl = environment.base;

  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean | null> = new BehaviorSubject<
    boolean | null
  >(null);

  token = '';
  constructor(
    private http: HttpClient,
    private dataStateService: DataStateService,
    private userStateService: UserStateService,
    private userDataService: UserDataService
  ) {
    this.loadToken();
  }

  // This method will check if the user is authenticated or not.
  async loadToken() {
    const token = await Preferences.get({ key: TOKEN_KEY });
    if (token && token.value) {
      this.isAuthenticated.next(true);
      this.token = token.value;
    } else {
      this.isAuthenticated.next(false);
    }
  }

  // This is a fake login method. It will return a token if the credentials are correct.
  login(credentials: { email: any; password: any }): Observable<any> {
    return this.http.post(this.baseUrl + `users/email-login`, credentials).pipe(
      map((data: any) => data.token),
      switchMap((token) => {
        return from(Preferences.set({ key: TOKEN_KEY, value: token }));
      }),
      tap(() => {
        // Очищаем данные предыдущего пользователя
        this.clearUserData();
        
        this.isAuthenticated.next(true);
        
        // Получаем токен из Preferences
        Preferences.get({ key: TOKEN_KEY }).then((result) => {
          if (result.value) {
            this.token = result.value;
            // Обновляем состояние пользователя
            this.userStateService.token$.next(result.value);
            this.userStateService.me$.next(jwtDecode(result.value));
            
            // Принудительно обновляем данные пользователя
            this.userDataService.forceRefreshUserData().subscribe();
          }
        });
      })
    );
  }

  // This is a fake logout method. It will remove the token from storage.
  async logout(): Promise<void> {
    await Preferences.remove({ key: TOKEN_KEY });
    this.isAuthenticated.next(false);
    
    // Очищаем данные пользователя при выходе
    this.clearUserData();
  }

  // Метод для очистки данных при смене пользователя
  clearUserData() {
    this.dataStateService.likedProducts$.next(null);
    this.dataStateService.cardsInMyCart$.next(null);
    this.dataStateService.myCards$.next(null);
    this.dataStateService.clearCache();
  }

  // This is a fake register method. It will return a token if the credentials are correct.
  register(credentials: any): Observable<any> {
    delete credentials.confirmPassword;
    credentials.phone = credentials.phone.code + credentials.phone.phone;
    return this.http
      .post(this.baseUrl + `users/email-register`, credentials)
      .pipe(
        map((data: any) => data.token),
        switchMap((token) => {
          return from(Preferences.set({ key: TOKEN_KEY, value: token }));
        }),
        tap(() => {
          // Очищаем данные предыдущего пользователя
          this.clearUserData();
          
          this.isAuthenticated.next(true);
          
          // Получаем токен из Preferences
          Preferences.get({ key: TOKEN_KEY }).then((result) => {
            if (result.value) {
              this.token = result.value;
              // Обновляем состояние пользователя
              this.userStateService.token$.next(result.value);
              this.userStateService.me$.next(jwtDecode(result.value));
              
              // Принудительно обновляем данные пользователя
              this.userDataService.forceRefreshUserData().subscribe();
            }
          });
        })
      );
  }

  checkEmailExists(email: string) {
    return this.http.post(this.baseUrl + `users/check-email-exists`, { email });
  }
}
