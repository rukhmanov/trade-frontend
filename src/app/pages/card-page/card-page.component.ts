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
import { ImageGalleryComponent } from 'src/app/entities/image-preview/image-gallery.component';
import { environment } from 'src/environments/environment';

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
    ImageGalleryComponent,
  ],
})
export class CardPageComponent implements OnInit {
  data: any = null;
  images = ['assets/images/card-image.png'];
  s3 = environment.s3;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsApiService: ProductsApiService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot?.paramMap?.get('id');
    if (id) {
      this.productsApiService.getCardById(id).subscribe({
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
