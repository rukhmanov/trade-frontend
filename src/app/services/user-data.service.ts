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
    // Загружаем лайки пользователя
    this.getLikedProducts().subscribe(
      (response) => {
        this.dataStateService.likedProducts$.next(response.data);
      },
      (error) => {
        console.log('Ошибка загрузки лайков:', error);
      }
    );

    // Загружаем корзину пользователя
    this.getProductsFromCart().subscribe(
      (response) => {
        this.dataStateService.cardsInMyCart$.next(response.data);
      },
      (error) => {
        console.log('Ошибка загрузки корзины:', error);
      }
    );

    // Загружаем товары пользователя
    this.getMyProducts().subscribe(
      (response) => {
        this.dataStateService.myCards$.next(response.data);
      },
      (error) => {
        console.log('Ошибка загрузки товаров пользователя:', error);
      }
    );
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