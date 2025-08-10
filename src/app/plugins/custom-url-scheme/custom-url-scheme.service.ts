import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { UserStateService } from '../../state/user-state.service';

@Injectable({
  providedIn: 'root'
})
export class CustomUrlSchemeService {
  private urlListener: any;

  constructor(
    private router: Router,
    private userStateService: UserStateService
  ) {
    this.initializeUrlListener();
  }

  private initializeUrlListener() {
    if (Capacitor.isNativePlatform()) {
      // Слушаем события открытия приложения по URL
      this.urlListener = App.addListener('appUrlOpen', (data) => {
        this.handleUrl(data.url);
      });
    }
  }

  private handleUrl(url: string) {
    console.log('App opened with URL:', url);
    
    try {
      const urlObj = new URL(url);
      
      // Проверяем, что это наш custom URL scheme
      if (urlObj.protocol === 'parsifal:') {
        const path = urlObj.pathname;
        
        if (path === '/auth/callback') {
          // Обрабатываем callback от авторизации
          this.handleAuthCallback(urlObj.searchParams);
        }
      }
    } catch (error) {
      console.error('Error parsing URL:', error);
    }
  }

  private handleAuthCallback(searchParams: URLSearchParams) {
    const accessToken = searchParams.get('access_token');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (accessToken) {
      // Успешная авторизация - обрабатываем токен
      console.log('Token received:', accessToken);
      // Перенаправляем на главную страницу
      this.router.navigate(['/tabs/all']);
    } else if (error) {
      // Ошибка авторизации
      console.error('Auth error:', error, errorDescription);
      this.router.navigate(['/auth'], { 
        queryParams: { error, error_description: errorDescription } 
      });
    } else {
      // Проверяем, есть ли токен в хэше (для OAuth Implicit Flow)
      const url = searchParams.toString();
      if (url.includes('access_token=')) {
        // Извлекаем токен из хэша
        const hashMatch = url.match(/access_token=([^&]+)/);
        if (hashMatch) {
          const token = hashMatch[1];
          console.log('Token found in hash:', token);
          this.router.navigate(['/tabs/all']);
          return;
        }
      }
      
      console.log('No token or error found in callback');
    }
  }

  // Метод для очистки ресурсов
  destroy() {
    if (this.urlListener) {
      this.urlListener.remove();
    }
  }
}
