import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProduct, ICartItem, ILikeItem } from 'src/app/entities/cards/types';

@Injectable({ providedIn: 'root' })
export class DataStateService {
  all$ = new BehaviorSubject<IProduct[] | null>(null);
  myCards$ = new BehaviorSubject<IProduct[] | null>(null);
  cardsInMyCart$ = new BehaviorSubject<any[] | null>(null);
  likedProducts$ = new BehaviorSubject<ILikeItem[] | null>(null);

  // Кеш для отслеживания времени последнего обновления
  private cache = {
    all: { data: null as IProduct[] | null, timestamp: 0 },
    myCards: { data: null as IProduct[] | null, timestamp: 0 },
    cart: { data: null as any[] | null, timestamp: 0 },
    liked: { data: null as ILikeItem[] | null, timestamp: 0 }
  };

  // Время жизни кеша в миллисекундах (5 минут)
  private readonly CACHE_TTL = 5 * 60 * 1000;

  constructor() {}

  // Проверяет, нужно ли обновлять данные
  shouldRefresh(cacheKey: keyof typeof this.cache): boolean {
    const cache = this.cache[cacheKey];
    return !cache.data || (Date.now() - cache.timestamp) > this.CACHE_TTL;
  }

  // Обновляет кеш для указанного ключа
  updateCache(cacheKey: keyof typeof this.cache, data: any): void {
    this.cache[cacheKey] = {
      data,
      timestamp: Date.now()
    };
  }

  // Получает данные из кеша
  getCachedData(cacheKey: keyof typeof this.cache): any {
    return this.cache[cacheKey].data;
  }

  // Очищает весь кеш
  clearCache(): void {
    Object.keys(this.cache).forEach(key => {
      this.cache[key as keyof typeof this.cache] = { data: null, timestamp: 0 };
    });
  }

  // Очищает конкретный кеш
  clearCacheItem(cacheKey: keyof typeof this.cache): void {
    this.cache[cacheKey] = { data: null, timestamp: 0 };
  }
}
