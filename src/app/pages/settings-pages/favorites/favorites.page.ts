import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonGrid, 
  IonRow, 
  IonCol,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { BackButtonComponent } from 'src/app/entities/back-button/back-button.component';
import { CompactCardComponent } from 'src/app/entities/cards/compact-card/compact-card.component';
import { IProduct, ILikeItem } from 'src/app/entities/cards/types';
import { DataStateService } from 'src/app/state/data-state.service';
import { ProductsApiService } from 'src/app/entities/cards/compact-card/services/cards-api.service';

const MOCK_FAVORITES: IProduct[] = [
  {
    id: 1,
    name: 'Мок-продукт 1',
    price: '1000',
    currency: 'RUB',
    quantity: '1',
    city: 'Москва',
    description: 'Описание продукта 1',
    photos: [],
    createDate: '',
    updateDate: '',
  },
  {
    id: 2,
    name: 'Мок-продукт 2',
    price: '2000',
    currency: 'RUB',
    quantity: '1',
    city: 'Санкт-Петербург',
    description: 'Описание продукта 2',
    photos: [],
    createDate: '',
    updateDate: '',
  },
];

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonRefresher,
    IonRefresherContent,
    CommonModule, 
    FormsModule, 
    BackButtonComponent, 
    CompactCardComponent
  ],
})
export class FavoritesPage implements OnInit {
  favorites: ILikeItem[] = [];

  constructor(
    private dataStateService: DataStateService,
    private productsApiService: ProductsApiService
  ) { }

  ngOnInit() {
    this.loadLikedProducts();
    
    // Подписываемся на изменения в лайках
    this.dataStateService.likedProducts$.subscribe((likes) => {
      if (likes) {
        this.favorites = likes;
      }
    });
  }

  private loadLikedProducts() {
    // Проверяем кеш перед загрузкой
    if (this.dataStateService.shouldRefresh('liked')) {
      this.productsApiService.getLikedProducts().subscribe((response) => {
        this.dataStateService.likedProducts$.next(response.data);
        this.favorites = response.data;
      });
    } else {
      // Используем данные из кеша
      const cachedLikes = this.dataStateService.getCachedData('liked');
      if (cachedLikes) {
        this.dataStateService.likedProducts$.next(cachedLikes);
        this.favorites = cachedLikes;
      }
    }
  }

  // Обработчик pull-to-refresh
  async handleRefresh(event: any) {
    try {
      // Очищаем кеш лайков для принудительного обновления
      this.dataStateService.clearCacheItem('liked');
      
      // Загружаем лайки заново
      await this.productsApiService.getLikedProducts().toPromise();
      
      event.target.complete();
    } catch (error) {
      console.error('Error refreshing favorites data:', error);
      event.target.complete();
    }
  }
}
