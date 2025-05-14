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
import { Router } from '@angular/router';

@Component({
  selector: 'app-all',
  templateUrl: 'all.page.html',
  styleUrls: ['all.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    EventCardComponent,
    CommonModule,
  ],
})
export class AllPage implements OnInit {
  constructor(
    private eventsApiService: EventsApiService,
    public eventStateService: EventStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.eventStateService.all$.value) {
      this.eventsApiService.getAll().subscribe();
    }
  }

  createEvent() {
    this.router.navigate(['/', 'create-card']);
  }
}
