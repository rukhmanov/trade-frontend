import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonButton, 
  IonIcon, 
  IonSpinner, 
  IonText 
} from '@ionic/angular/standalone';
import { AuthService } from '../auth.service';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-universal-auth',
  templateUrl: './universal-auth.component.html',
  styleUrls: ['./universal-auth.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonIcon, IonSpinner, IonText]
})
export class UniversalAuthComponent implements OnInit, OnDestroy {
  isLoading = false;
  errorMessage = '';
  private subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Проверяем, есть ли токен в URL (возврат из браузера)
    this.checkForTokenInUrl();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private checkForTokenInUrl() {
    // Проверяем URL на наличие токена (для возврата из браузера)
    // Сначала проверяем query параметры
    const urlParams = new URLSearchParams(window.location.search);
    let accessToken = urlParams.get('access_token');
    let error = urlParams.get('error');

    // Если токен не найден в query params, проверяем хэш (для OAuth Implicit Flow)
    if (!accessToken && !error) {
      const hash = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      accessToken = hashParams.get('access_token');
      error = hashParams.get('error');
    }

    if (accessToken) {
      this.processToken(accessToken);
    } else if (error) {
      this.errorMessage = `Ошибка авторизации: ${error}`;
    }
  }

           async yandexSignIn() {
           this.isLoading = true;
           this.errorMessage = '';

           try {
             if (Capacitor.isNativePlatform()) {
               // Для iOS открываем браузер с callback URL
               const callbackUrl = this.getCallbackUrl();
               const authUrl = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${environment.yandexClientId}&redirect_uri=${encodeURIComponent(callbackUrl)}`;

               console.log('🔍 iOS Yandex auth URL:', authUrl);
               console.log('🔍 Callback URL:', callbackUrl);

               await Browser.open({
                 url: authUrl,
                 windowName: '_self'
               });
             } else {
               // Для веба используем стандартный подход
               this.authService.yandexSignIn();
             }
           } catch (error) {
             console.error('Ошибка при входе через Яндекс:', error);
             this.errorMessage = 'Ошибка при входе через Яндекс';
           } finally {
             this.isLoading = false;
           }
         }

  async googleSignIn() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.googleSignIn();
    } catch (error) {
      console.error('Ошибка при входе через Google:', error);
      this.errorMessage = 'Ошибка при входе через Google';
    } finally {
      this.isLoading = false;
    }
  }

  private getCallbackUrl(): string {
    // Создаем callback URL для возврата в приложение
    if (Capacitor.isNativePlatform()) {
      // Для iOS используем custom URL scheme
      return 'parsifal://auth/callback';
    } else {
      // Для веба используем текущий URL
      return window.location.origin + '/auth/callback';
    }
  }

  private processToken(accessToken: string) {
    this.isLoading = true;
    this.errorMessage = '';

    this.subscription.add(
      this.authService.processYandexToken(accessToken).subscribe({
        next: () => {
          this.isLoading = false;
          // Токен успешно обработан, перенаправляем на главную
          this.router.navigate(['/tabs/all']);
        },
        error: (error) => {
          console.error('Ошибка при обработке токена:', error);
          this.errorMessage = 'Ошибка при обработке токена';
          this.isLoading = false;
        }
      })
    );
  }

  clearError() {
    this.errorMessage = '';
  }
}
