import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../entities/auth/types';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { DataStateService } from './data-state.service';
import { ProductsApiService } from '../entities/cards/compact-card/services/cards-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  me$ = new BehaviorSubject<IUser | null>(null);
  myAvatar$ = new BehaviorSubject<Blob | null>(null);
  token$ = new BehaviorSubject<string | null>('');

  constructor(
    private http: HttpClient,
    private dataStateService: DataStateService,
    private productsApiService: ProductsApiService
  ) {
    this.token$.subscribe((token) => {
      if (token) {
        localStorage.setItem('token', token);
        // Загружаем данные пользователя при установке токена
        this.loadUserData();
      }
    });

    const tokenFromStorage = localStorage.getItem('token');

    if (tokenFromStorage) {
      console.log('me ==> ', jwtDecode(tokenFromStorage));

      this.token$.next(tokenFromStorage);
      this.me$.next(jwtDecode(tokenFromStorage));
      // Загружаем данные пользователя при восстановлении токена
      this.loadUserData();
    }
  }

  private loadUserData() {
    // Загружаем лайки пользователя
    this.productsApiService.getLikedProducts().subscribe(
      (response) => {
        this.dataStateService.likedProducts$.next(response.data);
      },
      (error) => {
        console.log('Ошибка загрузки лайков:', error);
      }
    );

    // Загружаем корзину пользователя
    this.productsApiService.getProductsFromCart().subscribe(
      (response) => {
        this.dataStateService.cardsInMyCart$.next(response.data);
      },
      (error) => {
        console.log('Ошибка загрузки корзины:', error);
      }
    );

    // Загружаем товары пользователя
    this.productsApiService.getMyProducts().subscribe(
      (response) => {
        this.dataStateService.myCards$.next(response.data);
      },
      (error) => {
        console.log('Ошибка загрузки товаров пользователя:', error);
      }
    );
  }

  getYandexAvatar(id: number | string) {
    return this.http.get(
      `https://avatars.yandex.net/get-yapic/${id}/islands-200`,
      { responseType: 'blob' }
    );
  }
}
