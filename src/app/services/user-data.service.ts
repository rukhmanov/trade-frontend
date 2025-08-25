import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataStateService } from '../state/data-state.service';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private baseUrl = environment.base;

  constructor(
    private http: HttpClient,
    private dataStateService: DataStateService
  ) {}

  loadUserData(): void {
    // Проверяем, есть ли токен
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }
    
    // Если это первый запуск, загружаем все данные
    if (this.dataStateService.isFirstLoadApp()) {
      this.loadAllUserData();
    }
  }

  // Загружает все данные пользователя (для первого запуска)
  private loadAllUserData(): void {
    // Загружаем лайки
    this.getLikedProducts().subscribe(
      (response) => {
        this.dataStateService.likedProducts$.next(response.data);
      },
      (error) => {
        console.log('Ошибка загрузки лайков:', error);
      }
    );

    // Загружаем корзину
    this.getProductsFromCart().subscribe(
      (response) => {
        this.dataStateService.cardsInMyCart$.next(response.data);
      },
      (error) => {
        console.log('Ошибка загрузки корзины:', error);
      }
    );

    // Загружаем мои товары
    this.getMyProducts().subscribe(
      (response) => {
        this.dataStateService.myCards$.next(response.data);
      },
      (error) => {
        console.log('Ошибка загрузки товаров пользователя:', error);
      }
    );

    // Отмечаем, что первый запуск завершен
    this.dataStateService.markFirstLoadComplete();
  }

  // Метод для принудительного обновления всех данных пользователя
  forceRefreshUserData(): Observable<any> {
    // Очищаем кеш
    this.dataStateService.clearCacheItem('liked');
    this.dataStateService.clearCacheItem('cart');
    this.dataStateService.clearCacheItem('myCards');

    // Загружаем все данные заново
    return new Observable(observer => {
      let completedRequests = 0;
      const totalRequests = 3;

      const checkComplete = () => {
        completedRequests++;
        if (completedRequests === totalRequests) {
          observer.next({ status: 'ok' });
          observer.complete();
        }
      };

      this.getLikedProducts().subscribe(
        (response) => {
          this.dataStateService.likedProducts$.next(response.data);
          checkComplete();
        },
        (error) => {
          console.log('Ошибка загрузки лайков:', error);
          checkComplete();
        }
      );

      this.getProductsFromCart().subscribe(
        (response) => {
          this.dataStateService.cardsInMyCart$.next(response.data);
          checkComplete();
        },
        (error) => {
          console.log('Ошибка загрузки корзины:', error);
          checkComplete();
        }
      );

      this.getMyProducts().subscribe(
        (response) => {
          this.dataStateService.myCards$.next(response.data);
          checkComplete();
        },
        (error) => {
          console.log('Ошибка загрузки товаров пользователя:', error);
          checkComplete();
        }
      );
    });
  }

  private getLikedProducts(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'products/likes');
  }

  private getProductsFromCart(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'products/cart');
  }

  private getMyProducts(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'products/my');
  }
} 