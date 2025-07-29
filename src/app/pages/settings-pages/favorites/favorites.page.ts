import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { BackButtonComponent } from 'src/app/entities/back-button/back-button.component';
import { CompactCardComponent } from 'src/app/entities/cards/compact-card/compact-card.component';
import { IProduct } from 'src/app/entities/cards/types';

const MOCK_FAVORITES: IProduct[] = [
  {
    id: 1,
    name: 'Мок-продукт 1',
    price: '1000',
    city: 'Москва',
    description: 'Описание продукта 1',
    photos: [],
    createDate: '',   // or a mock date string, e.g. '2024-01-01'
    updateDate: '',   // or a mock date string
  },
  {
    id: 2,
    name: 'Мок-продукт 2',
    price: '2000',
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
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BackButtonComponent, CompactCardComponent],
})
export class FavoritesPage implements OnInit {
  favorites: IProduct[] = MOCK_FAVORITES;
  constructor() { }
  ngOnInit() {}
}
