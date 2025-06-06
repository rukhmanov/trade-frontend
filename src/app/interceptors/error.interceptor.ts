import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpResponse,
  HttpEvent,
} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const toastController = inject(ToastController);

  return next(req).pipe(
    // ✅ Обработка успешных ответов
    tap((event) => {
      if (event instanceof HttpResponse) {
        if (req.method === 'POST') {
          // showToast(toastController, 'Успешно создано', 'success');
        } else if (req.method === 'PUT' || req.method === 'PATCH') {
          showToast(toastController, 'Успешно обновлено', 'success');
        }
      }
    }),

    // ❌ Обработка ошибок
    catchError((error: HttpErrorResponse) => {
      const message = getErrorMessage(error);

      showToast(toastController, message, 'danger');

      return throwError(() => error);
    })
  );
};

// 🔧 Вспомогательная функция для вывода Toast
function showToast(
  toastController: ToastController,
  message: string,
  color: 'success' | 'danger'
) {
  toastController
    .create({
      message,
      duration: 3000,
      color,
      position: 'top',
    })
    .then((toast) => toast.present());
}

// 🧠 Сообщение об ошибке
function getErrorMessage(error: HttpErrorResponse): string {
  if (error.error instanceof ErrorEvent) {
    return `Ошибка клиента: ${error.error.message}`;
  } else if (error.status === 0) {
    return 'Нет подключения к серверу';
  } else {
    return `Ошибка сервера (${error.status}): ${error.message}`;
  }
}
