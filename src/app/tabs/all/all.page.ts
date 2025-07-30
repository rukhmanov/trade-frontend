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
  ) {}

  ngOnInit(): void {
    if (!this.dataStateService.all$.value) {
      this.productsApiService.getAll().subscribe();
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

  createEvent() {
    this.router.navigate(['/', 'create-card']);
  }
}
