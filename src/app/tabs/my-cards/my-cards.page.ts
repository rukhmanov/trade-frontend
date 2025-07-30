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
} from '@ionic/angular/standalone';

import { DataStateService } from '../../state/data-state.service';
import { UserStateService } from '../../state/user-state.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductsApiService } from 'src/app/entities/cards/compact-card/services/cards-api.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { CompactCardComponent } from 'src/app/entities/cards/compact-card/compact-card.component';

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
  ) {}

  ngOnInit(): void {
    if (!this.dataStateService.myCards$.value) {
      this.productsApiService.getMyProducts().subscribe();
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

  create() {
    this.router.navigate(['/', 'create-card']);
  }
}
