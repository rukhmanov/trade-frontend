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
import { UserDataService } from 'src/app/services/user-data.service';
import { UserStateService } from 'src/app/state/user-state.service';

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
  isLoggedIn = false;

  constructor(
    public commonStateService: CommonStateService,
    private dataStateService: DataStateService,
    private userDataService: UserDataService,
    private userStateService: UserStateService
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
    // Подписываемся на состояние авторизации
    this.userStateService.me$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn) {
        // Загружаем данные только для авторизованных пользователей
        this.loadUserData();
      }
    });
    
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
    // Обновляем данные при переходе на вкладку только для авторизованных пользователей
    if (this.isLoggedIn) {
      this.loadUserData();
    }
  }

  private loadUserData() {
    this.userDataService.loadUserData();
  }
}
