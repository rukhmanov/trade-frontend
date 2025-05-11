import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonContent,
  IonButton,
} from '@ionic/angular/standalone';

import { EventCardComponent } from '../../entities/events/event-card/event-card.component';
import { EventsApiService } from '../../entities/events/event-card/services/events-api.service';
import { EventStateService } from '../../state/event-state.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-events',
  templateUrl: 'my-events.page.html',
  styleUrls: ['my-events.page.scss'],
  imports: [
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonContent,
    EventCardComponent,
    CommonModule,
  ],
})
export class MyEventsPage implements OnInit {
  constructor(
    private router: Router,
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

  createEvent() {
    this.router.navigate(['/', 'create-event']);
  }
}
