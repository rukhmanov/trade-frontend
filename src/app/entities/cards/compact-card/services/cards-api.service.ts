import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DataStateService } from 'src/app/state/data-state.service';
import { environment } from 'src/environments/environment';
import { IProduct, IProductResponse, IProductDetailResponse, ICartItem, ILikeItem, IApiResponse } from 'src/app/entities/cards/types';

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  baseUrl = environment.base;
  constructor(
    private http: HttpClient,
    private dataStateService: DataStateService
  ) {}

  getAll(): Observable<IProductResponse> {
    return this.http
      .get<IProductResponse>(environment.base + 'products/')
      .pipe(tap((response) => this.dataStateService.all$.next(response.data)));
  }

  getMyProducts(): Observable<IProductResponse> {
    return this.http
      .get<IProductResponse>(this.baseUrl + 'products/my')
      .pipe(tap((response) => this.dataStateService.myCards$.next(response.data)));
  }

  getProductById(id: number | string): Observable<IProductDetailResponse> {
    return this.http.get<IProductDetailResponse>(this.baseUrl + 'products/' + id);
  }

  like(productId: number | string): Observable<IApiResponse> {
    return this.http.post<IApiResponse>(this.baseUrl + 'products/like', { productId });
  }

  addProductsToCart(productId: number | string): Observable<IApiResponse> {
    return this.http.post<IApiResponse>(this.baseUrl + 'products/cart', { productId });
  }

  removeFromCart(productId: number | string): Observable<IApiResponse> {
    return this.http.delete<IApiResponse>(this.baseUrl + 'products/cart/' + productId);
  }

  getProductsFromCart(): Observable<IProductResponse> {
    return this.http
      .get<IProductResponse>(this.baseUrl + 'products/cart')
      .pipe(tap((response) => this.dataStateService.cardsInMyCart$.next(response.data)));
  }
}
