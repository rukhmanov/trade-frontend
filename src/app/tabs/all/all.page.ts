import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonCol,
  IonRow,
} from '@ionic/angular/standalone';
import { CompactCardComponent } from '../../entities/cards/compact-card/compact-card.component';
import { ProductsApiService } from '../../entities/cards/compact-card/services/cards-api.service';
import { CommonModule } from '@angular/common';
import { EventStateService } from '../../state/event-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all',
  templateUrl: 'all.page.html',
  styleUrls: ['all.page.scss'],
  imports: [
    IonRow,
    IonCol,
    IonGrid,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CompactCardComponent,
    CommonModule,
  ],
})
export class AllPage implements OnInit {
  constructor(
    private productsApiService: ProductsApiService,
    public dataStateService: EventStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.dataStateService.all$.value) {
      this.productsApiService.getAll().subscribe();
    }
  }

  createEvent() {
    this.router.navigate(['/', 'create-card']);
  }
}
