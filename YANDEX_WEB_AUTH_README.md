# Веб-авторизация Яндекса

## Описание

Реализована веб-авторизация через Яндекс OAuth 2.0 с использованием redirect URI для веб-сервисов.

## Настройка

### 1. Настройка в Яндекс OAuth

В настройках приложения в Яндекс OAuth необходимо добавить:

**Redirect URI для веб-сервисов:**
```
https://parsifal-trade.netlify.app/remote-login-back
```

### 2. Конфигурация

В файле `src/environments/environment.ts` и `src/environments/environment.prod.ts` настроены:

- `yandexClientId`: ID приложения в Яндекс OAuth
- `frondProdHost`: URL фронтенда для redirect URI

### 3. Поток авторизации

1. Пользователь нажимает кнопку "Яндекс (Веб)" в компоненте аутентификации
2. Происходит редирект на `https://oauth.yandex.ru/authorize` с параметрами:
   - `response_type=token`
   - `client_id=<YOUR_CLIENT_ID>`
   - `redirect_uri=<FRONTEND_URL>/remote-login-back`

3. После успешной авторизации Яндекс возвращает токен в URL fragment
4. Компонент `remote-login-back` обрабатывает токен и отправляет его на сервер
5. Сервер возвращает JWT токен, который сохраняется в состоянии приложения
6. Пользователь перенаправляется на главную страницу

## Компоненты

### AuthService
- `yandexWebLogin()`: Инициирует веб-авторизацию
- `processYandexToken()`: Обрабатывает полученный токен и отправляет на сервер

### RemoteLoginBackComponent
Обрабатывает возврат от Яндекса и извлекает токен из URL fragment.

### RemoteLoginTargetComponent
Альтернативный компонент для обработки токена через query parameters.

## API Endpoints

- `POST /users/auth/` - Отправка токена Яндекса и получение JWT

## Использование

```typescript
// В компоненте
this.authService.yandexWebLogin();
```

## Безопасность

- Токен от Яндекса передается только на сервер
- JWT токен сохраняется в состоянии приложения
- При выходе все токены очищаются

## Исправления

### Ошибка InvalidTokenError
Исправлена ошибка `InvalidTokenError: Invalid token specified: must be a string` в `jwtDecode`.

**Проблема:** Сервер возвращает ответ в формате `{ status: 'ok', data: jwt }`, а код пытался деструктурировать `{ jwt }`.

**Решение:** Обновлен метод `processYandexToken()` для правильной обработки ответа сервера:

```typescript
// Было:
.post<{ jwt: string }>(environment.base + 'users/auth/', {
  accessToken: accessToken,
})
.pipe(
  tap(({ jwt }) => {
    // ...
  })
)

// Стало:
.post<{ status: string; data: string }>(environment.base + 'users/auth/', {
  accessToken: accessToken,
})
.pipe(
  tap((response) => {
    const jwt = response.data;
    // ...
  })
)
```

## Отладка

Для отладки проверьте:
1. Правильность redirect URI в настройках Яндекс OAuth
2. Консоль браузера на наличие ошибок
3. Сетевые запросы в DevTools
4. Формат ответа от сервера (должен быть `{ status: 'ok', data: jwt }`) 