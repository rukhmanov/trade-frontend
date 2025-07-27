import { Pipe, PipeTransform } from '@angular/core';
import { E_AuthService } from './types';

@Pipe({
  name: 'authImage',
})
export class AuthImagePipe implements PipeTransform {
  transform(avatarId: string, authService: E_AuthService): unknown {
    switch (authService) {
      case E_AuthService.Yandex:
        return `https://avatars.yandex.net/get-yapic/${avatarId}/islands-200`;
    }
    return avatarId;
  }
}
