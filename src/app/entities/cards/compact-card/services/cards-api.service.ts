import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DataStateService } from 'src/app/state/data-state.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  baseUrl = environment.base;
  constructor(
    private http: HttpClient,
    private dataStateService: DataStateService
  ) {}

  getAll(): Observable<any> {
    return this.http
      .get<any>(environment.base + 'products/')
      .pipe(tap((all) => this.dataStateService.all$.next(all)));
  }

  getMyProducts(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + 'products/my')
      .pipe(tap((all) => this.dataStateService.myCards$.next(all)));
  }

  getProductById(id: number | string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'products/' + id);
  }

  like(productId: number | string): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'products/like', { productId });
  }

  addProductsToCart(productId: number | string): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'products/cart', { productId });
  }

  removeFromCart(productId: number | string): Observable<any> {
    return this.http.delete<any>(this.baseUrl + 'products/cart/' + productId);
  }

  getProductsFromCart(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + 'products/cart')
      .pipe(tap((all) => this.dataStateService.cardsInMyCart$.next(all)));
  }
}
