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
  }

  create() {
    this.router.navigate(['/', 'create-card']);
  }
}
