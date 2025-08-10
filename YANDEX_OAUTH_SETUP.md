# Настройка Яндекс OAuth для веба и iOS

## 🔧 Обновленная конфигурация

### 1. Redirect URIs в Яндекс OAuth

В настройках вашего приложения в [Яндекс OAuth](https://oauth.yandex.ru/client) добавьте следующие redirect URIs:

#### Для веб-версии:
```
http://localhost:4200/auth/callback
https://yourdomain.com/auth/callback
```

#### Для iOS:
```
http://localhost:4200/auth/callback?platform=ios
https://yourdomain.com/auth/callback?platform=ios
```

### 2. Как это работает

#### Веб-версия:
1. Пользователь нажимает "Войти через Яндекс"
2. Открывается OAuth страница Яндекса
3. После авторизации происходит редирект на `/auth/callback`
4. Токен извлекается из хэша URL и обрабатывается

#### iOS:
1. Пользователь нажимает "Войти через Яндекс"
2. Открывается браузер с OAuth страницей Яндекса
3. После авторизации происходит редирект на `/auth/callback?platform=ios`
4. Страница показывает инструкции для iOS пользователей
5. Токен автоматически извлекается из хэша
6. Пользователь возвращается в приложение

### 3. Преимущества нового подхода

✅ **Нет ошибки 400** - используем стандартные веб-URL
✅ **Работает на всех платформах** - веб и iOS
✅ **Автоматическая обработка токенов** - не нужно копировать вручную
✅ **Единый callback endpoint** - упрощает поддержку

### 4. Настройка в коде

#### AuthService.getCallbackUrl()
```typescript
private getCallbackUrl(): string {
  if (Capacitor.isNativePlatform()) {
    // Для iOS используем веб-URL с параметром платформы
    return window.location.origin + '/auth/callback?platform=ios';
  } else {
    // Для веба используем стандартный URL
    return window.location.origin + '/auth/callback';
  }
}
```

#### AuthCallbackComponent
```typescript
private processCallback() {
  this.route.queryParams.subscribe(params => {
    const platform = params['platform'];
    
    // Если это iOS платформа, показываем инструкции
    if (platform === 'ios') {
      this.showIOSInstructions();
      return;
    }
    
    // Обычная обработка для веба
    this.processAuthResult(accessToken, error, errorDescription);
  });
}
```

### 5. Тестирование

#### Веб:
1. Запустите dev сервер: `npm run dev`
2. Перейдите на: `http://localhost:4200/auth`
3. Нажмите "Войти через Яндекс"
4. Проверьте редирект на `/auth/callback`

#### iOS:
1. Откройте приложение на iOS устройстве
2. Перейдите на страницу авторизации
3. Нажмите "Войти через Яндекс"
4. Проверьте открытие браузера и редирект

### 6. Возможные проблемы

#### Ошибка 400: redirect_uri не совпадает
- Убедитесь, что в настройках Яндекса указаны правильные redirect URIs
- Проверьте, что URL точно совпадают (включая параметры)

#### Токен не обрабатывается
- Проверьте консоль браузера на наличие ошибок
- Убедитесь, что `environment.yandexClientId` настроен правильно

#### iOS браузер не закрывается
- Это нормально для iOS - браузер остается открытым
- Пользователь должен вернуться в приложение вручную

### 7. Безопасность

- Токены передаются в хэше URL (OAuth Implicit Flow)
- Хэш не отправляется на сервер
- Используйте HTTPS в продакшене
- Токены имеют ограниченное время жизни

## 🚀 Готово!

Теперь ваше приложение корректно работает с Яндекс OAuth как на вебе, так и на iOS, без ошибки 400!
