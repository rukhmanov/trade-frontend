import { Component, Input, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { IEvent } from '../types';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
  ],
})
export class EventCardComponent implements OnInit {
  @Input() event: IEvent | null = null;
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {}
  navigate() {
    this.router.navigate([this.event?.id], {
      relativeTo: this.route,
    });
  }
}
