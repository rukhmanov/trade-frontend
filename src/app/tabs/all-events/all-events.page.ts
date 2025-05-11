import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { EventCardComponent } from '../../entities/events/event-card/event-card.component';
import { EventsApiService } from '../../entities/events/event-card/services/events-api.service';
import { CommonModule } from '@angular/common';
import { EventStateService } from '../../state/event-state.service';

@Component({
  selector: 'app-all-events',
  templateUrl: 'all-events.page.html',
  styleUrls: ['all-events.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    EventCardComponent,
    CommonModule,
  ],
})
export class AllEventsPage implements OnInit {
  constructor(
    private eventsApiService: EventsApiService,
    public eventStateService: EventStateService
  ) {}

  ngOnInit(): void {
    if (!this.eventStateService.allEvents$.value) {
      this.eventsApiService.getAllEvents().subscribe();
    }
  }
}
