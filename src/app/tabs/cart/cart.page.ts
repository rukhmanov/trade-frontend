import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';

import { CompactCardComponent } from '../../entities/cards/compact-card/compact-card.component';
import { CommonModule } from '@angular/common';
import { DataStateService } from 'src/app/state/data-state.service';
import { ProductsApiService } from 'src/app/entities/cards/compact-card/services/cards-api.service';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.page.html',
  styleUrls: ['cart.page.scss'],
  imports: [
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
    public productsApiService: ProductsApiService
  ) {}

  ngOnInit(): void {
    if (!this.dataStateService.cardsInMyCart$.value) {
      this.productsApiService.getProductsInCart().subscribe();
    }
  }
}
