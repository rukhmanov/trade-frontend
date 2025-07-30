import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/angular/standalone';

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
  ) {}

  ngOnInit(): void {
    if (!this.dataStateService.cardsInMyCart$.value) {
      this.productsApiService.getProductsFromCart().subscribe();
    }
    
    // Принудительно загружаем данные пользователя при инициализации страницы
    this.loadUserData();
  }

  ionViewWillEnter() {
    // Загружаем данные пользователя при каждом входе на страницу
    this.loadUserData();
  }

  private loadUserData() {
    // Загружаем данные только для авторизованных пользователей
    if (this.userStateService.me$.value) {
      this.userDataService.loadUserData();
    }
  }
}
