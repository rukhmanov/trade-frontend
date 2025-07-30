import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, inject, OnInit } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  triangle,
  ellipse,
  square,
  cart,
  search,
  cogOutline,
  addCircle,
  logOutOutline,
} from 'ionicons/icons';
import { CommonStateService } from 'src/app/state/common-state.service';
import { DataStateService } from 'src/app/state/data-state.service';
import { ProductsApiService } from 'src/app/entities/cards/compact-card/services/cards-api.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [CommonModule, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge],
})
export class TabsPage implements OnInit {
  public environmentInjector = inject(EnvironmentInjector);
  cartCount = 0;
  myCardsCount = 0;

  constructor(
    public commonStateService: CommonStateService,
    private dataStateService: DataStateService,
    private productsApiService: ProductsApiService
  ) {
    addIcons({
      triangle,
      logOutOutline,
      ellipse,
      square,
      cart,
      addCircle,
      search,
      cogOutline,
    });
  }

  ngOnInit() {
    // Загружаем данные при инициализации
    this.loadCartData();
    this.loadMyCardsData();
    
    // Подписываемся на изменения в корзине
    this.dataStateService.cardsInMyCart$.subscribe((cartItems: any) => {
      this.cartCount = Array.isArray(cartItems) ? cartItems.length : 0;
    });

    // Подписываемся на изменения в созданных товарах
    this.dataStateService.myCards$.subscribe((myCards: any) => {
      this.myCardsCount = Array.isArray(myCards) ? myCards.length : 0;
    });
  }

  onTabClick() {
    // Обновляем данные при переходе на вкладку
    this.loadCartData();
    this.loadMyCardsData();
  }

  private loadCartData() {
    this.productsApiService.getProductsFromCart().subscribe();
  }

  private loadMyCardsData() {
    this.productsApiService.getMyProducts().subscribe();
  }
}
