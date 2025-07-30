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
    
    // Проверяем кеш для лайков
    if (this.dataStateService.shouldRefresh('liked')) {
      this.getLikedProducts().subscribe(
        (response) => {
          this.dataStateService.likedProducts$.next(response.data);
          this.dataStateService.updateCache('liked', response.data);
        },
        (error) => {
          console.log('Ошибка загрузки лайков:', error);
        }
      );
    } else {
      // Используем данные из кеша
      const cachedLikes = this.dataStateService.getCachedData('liked');
      if (cachedLikes) {
        this.dataStateService.likedProducts$.next(cachedLikes);
      }
    }

    // Проверяем кеш для корзины
    if (this.dataStateService.shouldRefresh('cart')) {
      this.getProductsFromCart().subscribe(
        (response) => {
          this.dataStateService.cardsInMyCart$.next(response.data);
          this.dataStateService.updateCache('cart', response.data);
        },
        (error) => {
          console.log('Ошибка загрузки корзины:', error);
        }
      );
    } else {
      // Используем данные из кеша
      const cachedCart = this.dataStateService.getCachedData('cart');
      if (cachedCart) {
        this.dataStateService.cardsInMyCart$.next(cachedCart);
      }
    }

    // Проверяем кеш для моих товаров
    if (this.dataStateService.shouldRefresh('myCards')) {
      this.getMyProducts().subscribe(
        (response) => {
          this.dataStateService.myCards$.next(response.data);
          this.dataStateService.updateCache('myCards', response.data);
        },
        (error) => {
          console.log('Ошибка загрузки товаров пользователя:', error);
        }
      );
    } else {
      // Используем данные из кеша
      const cachedMyCards = this.dataStateService.getCachedData('myCards');
      if (cachedMyCards) {
        this.dataStateService.myCards$.next(cachedMyCards);
      }
    }
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
          this.dataStateService.updateCache('liked', response.data);
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
          this.dataStateService.updateCache('cart', response.data);
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
          this.dataStateService.updateCache('myCards', response.data);
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