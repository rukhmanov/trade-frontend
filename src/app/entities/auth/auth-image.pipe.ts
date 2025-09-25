import { Pipe, PipeTransform } from '@angular/core';
import { E_AuthService } from './types';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'authImage',
})
export class AuthImagePipe implements PipeTransform {
  transform(avatarId: string, authService?: E_AuthService | string): string {
    if (!avatarId) {
      return '';
    }

    // Если avatarId уже является полным URL, возвращаем как есть
    if (avatarId.startsWith('http://') || avatarId.startsWith('https://')) {
      return avatarId;
    }

    // Обрабатываем разные сервисы аутентификации
    const authServiceStr = String(authService).toLowerCase();
    
    switch (authServiceStr) {
      case 'yandex':
        return `https://avatars.yandex.net/get-yapic/${avatarId}/islands-200`;
      case 'google':
        return avatarId;
      case 'email':
        // Для email аутентификации avatarId может быть относительным путем
        if (avatarId.startsWith('/')) {
          return `${environment.base}${avatarId}`;
        }
        return avatarId;
      default:
        // Если сервис не определен, предполагаем что это относительный путь
        if (avatarId.startsWith('/')) {
          return `${environment.base}${avatarId}`;
        }
        return avatarId;
    }
  }
}
