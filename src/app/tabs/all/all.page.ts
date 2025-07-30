import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonCol,
  IonRow,
} from '@ionic/angular/standalone';
import { CompactCardComponent } from '../../entities/cards/compact-card/compact-card.component';
import { ProductsApiService } from '../../entities/cards/compact-card/services/cards-api.service';
import { CommonModule } from '@angular/common';
import { DataStateService } from '../../state/data-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all',
  templateUrl: 'all.page.html',
  styleUrls: ['all.page.scss'],
  imports: [
    IonRow,
    IonCol,
    IonGrid,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CompactCardComponent,
    CommonModule,
  ],
})
export class AllPage implements OnInit {
  constructor(
    private productsApiService: ProductsApiService,
    public dataStateService: DataStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.dataStateService.all$.value) {
      this.productsApiService.getAll().subscribe();
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
    } else {
      // Если лайки уже есть, обновляем их
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

  createEvent() {
    this.router.navigate(['/', 'create-card']);
  }
}
