import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonButton, 
  IonIcon, 
  IonSpinner 
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonIcon, IonSpinner]
})
export class AuthCallbackComponent implements OnInit, OnDestroy {
  isLoading = true;
  errorMessage = '';
  isIOSPlatform = false;
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.processCallback();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private processCallback() {
    // Получаем параметры из URL (query params)
    this.route.queryParams.subscribe(params => {
      const accessToken = params['access_token'];
      const error = params['error'];
      const errorDescription = params['error_description'];
      const platform = params['platform'];

      // Если токен не найден в query params, проверяем хэш
      if (!accessToken && !error) {
        this.processHashParams();
        return;
      }

      // Если это iOS платформа, показываем инструкции
      if (platform === 'ios') {
        this.showIOSInstructions();
        return;
      }

      this.processAuthResult(accessToken, error, errorDescription);
    });
  }

  private processHashParams() {
    // Получаем параметры из хэша URL (для OAuth Implicit Flow)
    const hash = window.location.hash.substring(1); // Убираем символ #
    const hashParams = new URLSearchParams(hash);
    
    const accessToken = hashParams.get('access_token');
    const error = hashParams.get('error');
    const errorDescription = hashParams.get('error_description');

    this.processAuthResult(accessToken, error, errorDescription);
  }

  private processAuthResult(accessToken: string | null, error: string | null, errorDescription: string | null) {
    if (accessToken) {
      // Успешная авторизация - обрабатываем токен
      this.subscription.add(
        this.authService.processYandexToken(accessToken).subscribe({
          next: () => {
            this.isLoading = false;
            // Перенаправляем на главную страницу
            setTimeout(() => {
              this.router.navigate(['/tabs/all']);
            }, 1000);
          },
          error: (error) => {
            console.error('Ошибка при обработке токена:', error);
            this.errorMessage = 'Ошибка при обработке токена авторизации';
            this.isLoading = false;
          }
        })
      );
    } else if (error) {
      // Ошибка авторизации
      this.errorMessage = errorDescription || `Ошибка авторизации: ${error}`;
      this.isLoading = false;
      
      // Через 3 секунды перенаправляем на страницу авторизации
      setTimeout(() => {
        this.router.navigate(['/auth']);
      }, 3000);
    } else {
      // Неизвестная ошибка
      this.errorMessage = 'Неизвестная ошибка при авторизации';
      this.isLoading = false;
      
      setTimeout(() => {
        this.router.navigate(['/auth']);
      }, 3000);
    }
  }

  goToAuth() {
    this.router.navigate(['/auth']);
  }

  private showIOSInstructions() {
    this.isLoading = false;
    this.errorMessage = '';
    this.isIOSPlatform = true;
    
    // Показываем инструкции для iOS пользователей
    // Они должны скопировать токен и вернуться в приложение
    
    // Автоматически обрабатываем токен из хэша
    this.processHashParams();
  }
}
