import { Pipe, PipeTransform } from '@angular/core';
import { E_AuthService } from './types';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'authImage',
})
export class AuthImagePipe implements PipeTransform {
  transform(avatarId: string, authService?: E_AuthService | string): string {
    if (!avatarId) {
      console.log('AuthImagePipe: avatarId is empty');
      return '';
    }

    console.log('AuthImagePipe: avatarId =', avatarId, 'authService =', authService);

    // Если avatarId уже является полным URL, возвращаем как есть
    if (avatarId.startsWith('http://') || avatarId.startsWith('https://')) {
      console.log('AuthImagePipe: returning full URL as is:', avatarId);
      return avatarId;
    }

    // Обрабатываем разные сервисы аутентификации
    const authServiceStr = String(authService).toLowerCase();
    
    switch (authServiceStr) {
      case 'yandex':
        const yandexUrl = `https://avatars.yandex.net/get-yapic/${avatarId}/islands-200`;
        console.log('AuthImagePipe: Yandex URL:', yandexUrl);
        return yandexUrl;
      case 'google':
        console.log('AuthImagePipe: Google - returning avatarId as is:', avatarId);
        return avatarId;
      case 'email':
        // Для email аутентификации avatarId может быть относительным путем
        if (avatarId.startsWith('/')) {
          const emailUrl = `${environment.base}${avatarId}`;
          console.log('AuthImagePipe: Email URL:', emailUrl);
          return emailUrl;
        }
        console.log('AuthImagePipe: Email - returning avatarId as is:', avatarId);
        return avatarId;
      default:
        // Если сервис не определен, предполагаем что это относительный путь
        if (avatarId.startsWith('/')) {
          const defaultUrl = `${environment.base}${avatarId}`;
          console.log('AuthImagePipe: Default URL:', defaultUrl);
          return defaultUrl;
        }
        console.log('AuthImagePipe: Default - returning avatarId as is:', avatarId);
        return avatarId;
    }
  }
}
