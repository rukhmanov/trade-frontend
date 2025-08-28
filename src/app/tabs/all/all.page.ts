import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonCol,
  IonRow,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownCircleOutline } from 'ionicons/icons';
import { CompactCardComponent } from '../../entities/cards/compact-card/compact-card.component';
import { ProductsApiService } from '../../entities/cards/compact-card/services/cards-api.service';
import { CommonModule } from '@angular/common';
import { DataStateService } from '../../state/data-state.service';
import { UserStateService } from '../../state/user-state.service';
import { UserDataService } from '../../services/user-data.service';
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
    IonRefresher,
    IonRefresherContent,
    CompactCardComponent,
    CommonModule,
  ],
})
export class AllPage implements OnInit {
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
    // Загружаем все товары только если их нет
    if (!this.dataStateService.all$.value) {
      this.productsApiService.getAll().subscribe();
    }
    
    // Загружаем данные пользователя только если авторизован и это первый запуск
    if (this.userStateService.me$.value && this.dataStateService.isFirstLoadApp()) {
      this.userDataService.loadUserData();
    }
  }

  ionViewWillEnter() {
    // Загружаем все товары только если их нет
    if (!this.dataStateService.all$.value) {
      this.productsApiService.getAll().subscribe();
    }
  }

  // Обработчик pull-to-refresh
  async handleRefresh(event: any) {
    try {
      // Очищаем кеш для принудительного обновления
      this.dataStateService.clearCacheItem('all');
      
      // Загружаем все товары заново
      await this.productsApiService.getAll().toPromise();
      
      // Загружаем данные пользователя если авторизован
      if (this.userStateService.me$.value) {
        await this.userDataService.forceRefreshUserData().toPromise();
      }
      
      event.target.complete();
    } catch (error) {
      console.error('Error refreshing data:', error);
      event.target.complete();
    }
  }

  createEvent() {
    this.router.navigate(['/', 'create-card']);
  }
}
