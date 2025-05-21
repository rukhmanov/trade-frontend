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
} from '@ionic/angular/standalone';

import { EventStateService } from '../../state/event-state.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductsApiService } from 'src/app/entities/cards/compact-card/services/cards-api.service';

@Component({
  selector: 'app-my-cards',
  templateUrl: 'my-cards.page.html',
  styleUrls: ['my-cards.page.scss'],
  imports: [
    IonText,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CommonModule,
    IonSelect,
    IonSelectOption,
  ],
})
export class MyCardsPage implements OnInit {
  constructor(
    private productsApiService: ProductsApiService,
    private eventStateService: EventStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.eventStateService.myEvents$.value) {
      this.productsApiService.getMyEvents().subscribe();
    }
    if (!this.eventStateService.eventsWithMe$.value) {
      this.productsApiService.getEventsWithMe().subscribe();
    }
  }

  create() {
    this.router.navigate(['/', 'create-card']);
  }
}
