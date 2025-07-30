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
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductsApiService } from 'src/app/entities/cards/compact-card/services/cards-api.service';
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
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.dataStateService.myCards$.value) {
      this.productsApiService.getMyProducts().subscribe();
    }
    
    // Принудительно загружаем лайки при инициализации страницы
    this.loadLikedProducts();
  }

  ionViewWillEnter() {
    // Загружаем лайки при каждом входе на страницу
    this.loadLikedProducts();
  }

  private loadLikedProducts() {
    // Проверяем, есть ли уже лайки в состоянии
    if (!this.dataStateService.likedProducts$.value) {
      this.productsApiService.getLikedProducts().subscribe(
        (response) => {
          this.dataStateService.likedProducts$.next(response.data);
        },
        (error) => {
          console.log('Ошибка загрузки лайков:', error);
        }
      );
    }
  }

  create() {
    this.router.navigate(['/', 'create-card']);
  }
}
