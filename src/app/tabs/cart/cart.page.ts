import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';

import { EventCardComponent } from '../../entities/events/event-card/event-card.component';
import { EventsApiService } from '../../entities/events/event-card/services/events-api.service';
import { EventStateService } from '../../state/event-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.page.html',
  styleUrls: ['cart.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    EventCardComponent,
    CommonModule,
  ],
})
export class CartPage implements OnInit {
  constructor(
    private eventsApiService: EventsApiService,
    public eventStateService: EventStateService
  ) {}

  ngOnInit(): void {
    if (!this.eventStateService.myEvents$.value) {
      this.eventsApiService.getMyEvents().subscribe();
    }
    if (!this.eventStateService.eventsWithMe$.value) {
      this.eventsApiService.getEventsWithMe().subscribe();
    }
  }
}
