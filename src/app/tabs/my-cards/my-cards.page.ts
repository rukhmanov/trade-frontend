import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';

import { DataStateService } from '../../state/data-state.service';
import { UserStateService } from '../../state/user-state.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductsApiService } from 'src/app/entities/cards/compact-card/services/cards-api.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { CompactCardComponent } from 'src/app/entities/cards/compact-card/compact-card.component';
import { chevronDownCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-my-cards',
  templateUrl: 'my-cards.page.html',
  styleUrls: ['my-cards.page.scss'],
  imports: [
    IonCol,
    IonRow,
    IonGrid,
    IonText,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    CommonModule,
    IonSelect,
    IonSelectOption,
    CompactCardComponent,
  ],
})
export class MyCardsPage implements OnInit {
  constructor(
    private productsApiService: ProductsApiService,
    public dataStateService: DataStateService,
    private userStateService: UserStateService,
    private userDataService: UserDataService,
    private router: Router
  ) {
        addIcons({
      chevronDownCircleOutline
    });
  }

  ngOnInit(): void {
    // Загружаем мои товары только если данных нет
    if (!this.dataStateService.myCards$.value) {
      this.productsApiService.getMyProducts().subscribe();
    }
    
    // Загружаем данные пользователя только если авторизован и это первый запуск
    if (this.userStateService.me$.value && this.dataStateService.isFirstLoadApp()) {
      this.userDataService.loadUserData();
    }
  }

  ionViewWillEnter() {
    // Загружаем мои товары только если данных нет
    if (!this.dataStateService.myCards$.value) {
      this.productsApiService.getMyProducts().subscribe();
    }
  }

  create() {
    this.router.navigate(['/', 'create-card']);
  }
}
