import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { heart, add, remove } from 'ionicons/icons';
import { IProduct } from '../types';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { addIcons } from 'ionicons';
import { CommonStateService } from 'src/app/state/common-state.service';
import { ProductsApiService } from './services/cards-api.service';
import { DataStateService } from 'src/app/state/data-state.service';

@Component({
  selector: 'app-compact-card',
  templateUrl: './compact-card.component.html',
  styleUrls: ['./compact-card.component.scss'],
  imports: [
    CommonModule,
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
  isInCart = false;
  cartQuantity = 0;

  @Input() data: IProduct | null = null;
  
  constructor(
    private router: Router,
    private commonStateService: CommonStateService,
    private productsApiService: ProductsApiService,
    private dataStateService: DataStateService
  ) {
    addIcons({
      heart,
      add,
      remove,
    });
  }

  ngOnInit() {
    this.checkCartStatus();
    
    // Подписываемся на изменения в корзине
    this.dataStateService.cardsInMyCart$.subscribe(() => {
      this.checkCartStatus();
    });
  }

  private checkCartStatus() {
    if (!this.data) return;
    
    const cartItems: any = this.dataStateService.cardsInMyCart$.value;
    if (Array.isArray(cartItems)) {
      const cartItem = cartItems.find((item: any) => item.id === this.data?.id);
      this.isInCart = !!cartItem;
      this.cartQuantity = cartItem?.quantity || 0;
    }
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
    if (this.data) {
      this.productsApiService.addProductsToCart(this.data.id).subscribe(() => {
        this.checkCartStatus();
      });
    }
  }

  increaseQuantity(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.data) {
      this.productsApiService.addProductsToCart(this.data.id).subscribe(() => {
        this.checkCartStatus();
      });
    }
  }

  decreaseQuantity(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.data && this.cartQuantity > 1) {
      this.productsApiService.removeFromCart(this.data.id).subscribe(() => {
        this.checkCartStatus();
      });
    } else if (this.data && this.cartQuantity === 1) {
      this.productsApiService.removeFromCart(this.data.id).subscribe(() => {
        this.checkCartStatus();
      });
    }
  }
}
