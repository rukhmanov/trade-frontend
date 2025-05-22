import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  IonToolbar,
  IonHeader,
  IonButton,
  IonIcon,
  IonContent,
} from '@ionic/angular/standalone';
import { BackButtonComponent } from 'src/app/entities/back-button/back-button.component';
import { ProductsApiService } from 'src/app/entities/cards/compact-card/services/cards-api.service';
import { ImageSliderComponent } from 'src/app/entities/image-slider/image-slider.component';

@Component({
  selector: 'app-card-page',
  templateUrl: './card-page.component.html',
  styleUrls: ['./card-page.component.scss'],
  imports: [
    IonContent,
    IonIcon,
    IonButton,
    IonHeader,
    IonToolbar,
    CommonModule,
    BackButtonComponent,
    ImageSliderComponent,
  ],
})
export class CardPageComponent implements OnInit {
  data: any = null;
  images = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsApiService: ProductsApiService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot?.paramMap?.get('id');
    if (id) {
      this.productsApiService.getProductById(id).subscribe({
        next: (data) => {
          console.log('event ==> ', data);
          this.data = data;
        },
        error: (error) => this.router.navigate(['/']),
      });
    }
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
