import { AfterViewInit, Component, Input } from '@angular/core';
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
import { IProduct } from '../types';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { addIcons } from 'ionicons';
import { CommonStateService } from 'src/app/state/common-state.service';
import { ProductsApiService } from './services/cards-api.service';
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
export class CompactCardComponent {
  s3 = environment.s3;

  @Input() data: IProduct | null = null;
  constructor(
    private router: Router,
    private commonStateService: CommonStateService,
    private productsApiService: ProductsApiService
  ) {
    addIcons({
      heart,
    });
  }

  navigate() {
    this.commonStateService.pendingByTime();
    this.router.navigate(['tabs', 'all', this.data?.id]);
  }

  like(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.data) this.productsApiService.like(this.data.id).subscribe();
  }

  buy(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.data) this.productsApiService.buy(this.data.id).subscribe();
  }
}
