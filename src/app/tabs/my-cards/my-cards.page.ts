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
  IonIcon,
} from '@ionic/angular/standalone';

import { EventsApiService } from '../../entities/events/event-card/services/events-api.service';
import { EventStateService } from '../../state/event-state.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
    private eventsApiService: EventsApiService,
    private eventStateService: EventStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.eventStateService.myEvents$.value) {
      this.eventsApiService.getMyEvents().subscribe();
    }
    if (!this.eventStateService.eventsWithMe$.value) {
      this.eventsApiService.getEventsWithMe().subscribe();
    }
  }

  create() {
    this.router.navigate(['/', 'create-card']);
  }
}
