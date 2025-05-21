import { Component, Input, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { heart } from 'ionicons/icons';
import { IEvent } from '../types';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { addIcons } from 'ionicons';
@Component({
  selector: 'app-compact-card',
  templateUrl: './compact-card.component.html',
  styleUrls: ['./compact-card.component.scss'],
  imports: [
    IonIcon,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
  ],
})
export class CompactCardComponent implements OnInit {
  s3 = environment.s3;

  @Input() data: IEvent | null = null;
  constructor(private router: Router, private route: ActivatedRoute) {
    addIcons({
      heart,
    });
  }

  ngOnInit() {}
  navigate() {
    this.router.navigate([this.data?.id], {
      relativeTo: this.route,
    });
  }

  like(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  buy(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
