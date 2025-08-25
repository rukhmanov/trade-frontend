import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCol,
  IonGrid,
  IonRow,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownCircleOutline } from 'ionicons/icons';

import { CompactCardComponent } from '../../entities/cards/compact-card/compact-card.component';
import { CommonModule } from '@angular/common';
import { DataStateService } from 'src/app/state/data-state.service';
import { UserStateService } from 'src/app/state/user-state.service';
import { ProductsApiService } from 'src/app/entities/cards/compact-card/services/cards-api.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.page.html',
  styleUrls: ['cart.page.scss'],
  imports: [
    IonRow,
    IonGrid,
    IonCol,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    CompactCardComponent,
    CommonModule,
  ],
})
export class CartPage implements OnInit {
  constructor(
    public dataStateService: DataStateService,
    public productsApiService: ProductsApiService,
    private userStateService: UserStateService,
    private userDataService: UserDataService
  ) {
    addIcons({
      chevronDownCircleOutline
    });
  }

  ngOnInit(): void {
    // Всегда загружаем корзину свежими данными
    this.productsApiService.getProductsFromCart().subscribe();
    
    // Загружаем данные пользователя только если авторизован
    if (this.userStateService.me$.value) {
      this.loadUserData();
    }
  }

  ionViewWillEnter() {
    // Всегда загружаем корзину свежими данными при входе на страницу
    this.productsApiService.getProductsFromCart().subscribe();
    
    // Загружаем данные пользователя только если авторизован
    if (this.userStateService.me$.value) {
      this.loadUserData();
    }
  }

  private loadUserData() {
    // Загружаем данные только для авторизованных пользователей
    if (this.userStateService.me$.value) {
      this.userDataService.loadUserData();
    }
  }

  // Обработчик pull-to-refresh
  async handleRefresh(event: any) {
    try {
      // Загружаем корзину заново
      await this.productsApiService.getProductsFromCart().toPromise();
      
      // Загружаем данные пользователя если авторизован
      if (this.userStateService.me$.value) {
        await this.userDataService.forceRefreshUserData().toPromise();
      }
      
      event.target.complete();
    } catch (error) {
      console.error('Error refreshing cart data:', error);
      event.target.complete();
    }
  }
}
