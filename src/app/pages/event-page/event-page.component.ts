import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonButton,
  IonContent,
} from '@ionic/angular/standalone';
import { of } from 'rxjs';
import { BackButtonComponent } from 'src/app/entities/back-button/back-button.component';
import { EventsApiService } from 'src/app/entities/events/event-card/services/events-api.service';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    BackButtonComponent,
  ],
})
export class EventPageComponent implements OnInit {
  event: any = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsApiService: EventsApiService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot?.paramMap?.get('id');
    if (id) {
      this.eventsApiService.getEventById(id).subscribe({
        next: (event) => (this.event = event),
        error: (error) => this.router.navigate(['/']),
      });
    }
  }
}
