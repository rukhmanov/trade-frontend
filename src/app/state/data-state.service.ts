import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProduct, ICartItem, ILikeItem } from 'src/app/entities/cards/types';

@Injectable({ providedIn: 'root' })
export class DataStateService {
  all$ = new BehaviorSubject<IProduct[] | null>(null);
  myCards$ = new BehaviorSubject<IProduct[] | null>(null);
  cardsInMyCart$ = new BehaviorSubject<any[] | null>(null);
  likedProducts$ = new BehaviorSubject<ILikeItem[] | null>(null);

  // Флаг для отслеживания первого запуска приложения
  private isFirstLoad = true;

  constructor() {}

  // Проверяет, является ли это первым запуском
  isFirstLoadApp(): boolean {
    return this.isFirstLoad;
  }

  // Отмечает, что первый запуск завершен
  markFirstLoadComplete(): void {
    this.isFirstLoad = false;
  }

  // Очищает весь кеш
  clearCache(): void {
    this.all$.next(null);
    this.myCards$.next(null);
    this.cardsInMyCart$.next(null);
    this.likedProducts$.next(null);
  }

  // Очищает конкретный кеш
  clearCacheItem(cacheKey: string): void {
    switch (cacheKey) {
      case 'all':
        this.all$.next(null);
        break;
      case 'myCards':
        this.myCards$.next(null);
        break;
      case 'cart':
        this.cardsInMyCart$.next(null);
        break;
      case 'liked':
        this.likedProducts$.next(null);
        break;
    }
  }
}
