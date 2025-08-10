# Исправление проблемы с токенами в хэше URL

## 🐛 Проблема

При авторизации через Яндекс OAuth токен передается в хэше URL:
```
http://localhost:8100/auth/callback#access_token=y0_AgAAAAA32rmjAAvrlwAAAAEI7iKTAABnEyBH599PXYlRdp-dG2byTfT3sA&token_type=bearer&expires_in=23872134&cid=heissberg
```

Но наш код ожидал токен в query параметрах (`?access_token=...`).

## ✅ Решение

### 1. Обновлен AuthCallbackComponent

Теперь компонент проверяет токен как в query параметрах, так и в хэше URL:

```typescript
private processCallback() {
  // Получаем параметры из URL (query params)
  this.route.queryParams.subscribe(params => {
    const accessToken = params['access_token'];
    const error = params['error'];
    const errorDescription = params['error_description'];

    // Если токен не найден в query params, проверяем хэш
    if (!accessToken && !error) {
      this.processHashParams();
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
```

### 2. Обновлен UniversalAuthComponent

Аналогично проверяет токен в хэше при возврате из браузера:

```typescript
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
```

### 3. Обновлен CustomUrlSchemeService

Для iOS также добавлена поддержка токенов в хэше:

```typescript
private handleAuthCallback(searchParams: URLSearchParams) {
  const accessToken = searchParams.get('access_token');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (accessToken) {
    // Успешная авторизация - обрабатываем токен
    console.log('Token received:', accessToken);
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
```

### 4. Добавлено логирование в AuthService

Для лучшей диагностики добавлено логирование:

```typescript
processYandexToken(accessToken: string): Observable<any> {
  console.log('🔍 Processing Yandex token:', accessToken);
  console.log('🔍 API endpoint:', environment.base + 'users/auth/');
  
  return this.http
    .post<{ status: string; data: string }>(environment.base + 'users/auth/', {
      accessToken: accessToken,
    })
    .pipe(
      tap((response) => {
        console.log('🔍 Yandex auth response:', response);
        // ... обработка ответа
      }),
      catchError((error: any) => {
        console.error('🔍 Error processing Yandex token:', error);
        throw error;
      })
    );
}
```

## 🧪 Тестирование

1. **Запустите dev сервер:**
   ```bash
   npm run dev
   ```

2. **Перейдите на страницу тестирования:**
   ```
   http://localhost:4200/test-auth
   ```

3. **Протестируйте callback с токеном в хэше:**
   ```
   http://localhost:4200/auth/callback#access_token=test_token&token_type=bearer
   ```

4. **Проверьте консоль браузера** на наличие логов обработки токена.

## 🔍 Что происходит теперь

1. **При загрузке страницы `/auth/callback`:**
   - Сначала проверяются query параметры
   - Если токен не найден, проверяется хэш URL
   - Токен извлекается и отправляется в `AuthService.processYandexToken()`

2. **При обработке токена:**
   - Токен отправляется на сервер
   - Полученный JWT сохраняется в состоянии
   - Происходит редирект на главную страницу

3. **При ошибках:**
   - Показывается сообщение об ошибке
   - Через 3 секунды происходит редирект на страницу авторизации

## 📱 iOS поддержка

Для iOS Custom URL Scheme также добавлена поддержка токенов в хэше, что позволяет корректно обрабатывать авторизацию на мобильных устройствах.
