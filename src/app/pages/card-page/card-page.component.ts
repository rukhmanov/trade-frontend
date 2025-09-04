import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  IonToolbar,
  IonHeader,
  IonButton,
  IonIcon,
  IonContent,
  ModalController,
  IonButtons,
  IonBackButton,
} from '@ionic/angular/standalone';
import { ProductsApiService } from 'src/app/entities/cards/compact-card/services/cards-api.service';
import { ImageSliderComponent } from 'src/app/entities/image-slider/image-slider.component';
import { DataStateService } from 'src/app/state/data-state.service';
import { UserStateService } from 'src/app/state/user-state.service';
import { IProduct, ICartItem, ILikeItem } from 'src/app/entities/cards/types';
import { addIcons } from 'ionicons';
import {
  heart,
  cart,
  trash,
  add,
  remove,
  checkmarkCircle,
  chevronBack,
  chevronForward
} from 'ionicons/icons';
import { ConfirmationModalComponent } from '../../entities/confirmation-modal';
import { PriceFormatPipe } from '../../pipes/price-format.pipe';

@Component({
  selector: 'app-card-page',
  templateUrl: './card-page.component.html',
  styleUrls: ['./card-page.component.scss'],
  imports: [
    CommonModule,
    IonIcon,
    IonButton,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    ImageSliderComponent,
    IonContent,
    PriceFormatPipe,
  ],
})
export class CardPageComponent implements OnInit {
  data: IProduct | null = null;
  images: string[] = [];
  isLiked = false;
  isInCart = false;
  cartQuantity = 0;
  isOwnProduct = false;
  currentUser: any = null;

  // Геттер для безопасного доступа к данным пользователя
  get ownerName(): string {
    if (!this.data?.user) return 'Пользователь';
    return this.data.user.fullName || this.data.user.firstName || 'Пользователь';
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsApiService: ProductsApiService,
    private dataStateService: DataStateService,
    private userStateService: UserStateService,
    private modalController: ModalController
  ) {
    addIcons({
      heart,
      cart,
      trash,
      add,
      remove,
      checkmarkCircle,
      chevronBack,
      chevronForward
    });
  }

  ngOnInit() {
    const id = this.route.snapshot?.paramMap?.get('id');
    if (id) {
      this.productsApiService.getProductById(id).subscribe({
        next: (response) => {
          this.data = response.data;
          this.images = this.data?.photos || [];
          this.checkLikeStatus();
          this.checkCartStatus();
          this.checkOwnership();
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.router.navigate(['/']);
        },
      });
    }

    // Подписываемся на изменения пользователя
    this.userStateService.me$.subscribe(user => {
      this.currentUser = user;
      if (this.data) {
        this.checkOwnership();
      }
    });

    // Загружаем данные о лайках и корзине если пользователь авторизован
    this.userStateService.me$.subscribe(user => {
      if (user) {
        this.loadUserData();
      }
    });
  }

  private loadUserData() {
    // Загружаем лайки
    this.productsApiService.getLikedProducts().subscribe({
      next: (response) => {
        this.dataStateService.likedProducts$.next(response.data);
        this.checkLikeStatus();
      },
      error: (error) => {
        console.error('Error loading liked products:', error);
      }
    });

    // Загружаем корзину
    this.productsApiService.getProductsFromCart().subscribe({
      next: (response) => {
        this.dataStateService.cardsInMyCart$.next(response.data);
        this.checkCartStatus();
      },
      error: (error) => {
        console.error('Error loading cart:', error);
      }
    });
  }

  private checkLikeStatus() {
    if (!this.data) return;
    
    const likedProducts = this.dataStateService.likedProducts$.value;
    if (likedProducts) {
      this.isLiked = likedProducts.some((like: ILikeItem) => like.product.id === this.data?.id);
    }
  }

  private checkCartStatus() {
    if (!this.data) return;
    
    const cartItems = this.dataStateService.cardsInMyCart$.value;
    if (cartItems) {
      const cartItem = cartItems.find((item: ICartItem) => 
        (item.product?.id || item.id) === this.data?.id
      );
      if (cartItem) {
        this.isInCart = true;
        this.cartQuantity = cartItem.quantity || 1;
      } else {
        this.isInCart = false;
        this.cartQuantity = 0;
      }
    }
  }

  private checkOwnership() {
    if (!this.data || !this.currentUser) return;
    
    // Временно отключаем проверку владельца
    // TODO: Добавить правильную проверку владельца товара
    this.isOwnProduct = false;
  }

  async like(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (!this.data) return;

    this.productsApiService.like(this.data.id).subscribe({
      next: (response) => {
        this.isLiked = response.data.liked;
        this.updateLikesState();
      },
      error: (error) => {
        console.error('Error liking product:', error);
      }
    });
  }

  private updateLikesState() {
    const currentLikedProducts = this.dataStateService.likedProducts$.value || [];
    
    if (this.isLiked) {
      // Добавляем в лайки
      if (!currentLikedProducts.some((like: ILikeItem) => like.product.id === this.data?.id)) {
        const newLike: ILikeItem = {
          id: Date.now(), // Временный ID
          productId: this.data!.id,
          userId: this.currentUser?.id || 0,
          product: this.data!,
          createdAt: new Date().toISOString()
        };
        this.dataStateService.likedProducts$.next([...currentLikedProducts, newLike]);
      }
    } else {
      // Удаляем из лайков
      const updatedLikes = currentLikedProducts.filter((like: ILikeItem) => like.product.id !== this.data?.id);
      this.dataStateService.likedProducts$.next(updatedLikes);
    }
  }

  async buy(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (!this.data) return;

    if (this.isInCart) {
      // Если товар уже в корзине, увеличиваем количество
      this.increaseQuantity(event);
    } else {
      // Добавляем в корзину
      this.productsApiService.addProductsToCart(this.data.id, 1).subscribe({
        next: (response) => {
          this.isInCart = true;
          this.cartQuantity = 1;
          this.addToCartState();
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
        }
      });
    }
  }

  increaseQuantity(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (!this.data || !this.isInCart) return;

    const newQuantity = this.cartQuantity + 1;
    this.productsApiService.updateCartQuantity(this.data.id, newQuantity).subscribe({
      next: (response) => {
        this.cartQuantity = newQuantity;
        this.updateCartState();
      },
      error: (error) => {
        console.error('Error updating cart quantity:', error);
      }
    });
  }

  decreaseQuantity(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (!this.data || !this.isInCart) return;

    if (this.cartQuantity <= 1) {
      // Удаляем из корзины
      this.productsApiService.removeFromCart(this.data.id).subscribe({
        next: (response) => {
          this.isInCart = false;
          this.cartQuantity = 0;
          this.removeFromCartState();
        },
        error: (error) => {
          console.error('Error removing from cart:', error);
        }
      });
    } else {
      // Уменьшаем количество
      const newQuantity = this.cartQuantity - 1;
      this.productsApiService.updateCartQuantity(this.data.id, newQuantity).subscribe({
        next: (response) => {
          this.cartQuantity = newQuantity;
          this.updateCartState();
        },
        error: (error) => {
          console.error('Error updating cart quantity:', error);
        }
      });
    }
  }

  private addToCartState() {
    const currentCartItems = this.dataStateService.cardsInMyCart$.value || [];
    const newCartItem: ICartItem = {
      id: Date.now(), // Временный ID
      productId: this.data!.id,
      userId: this.currentUser?.id || 0,
      quantity: 1,
      product: this.data!
    };
    this.dataStateService.cardsInMyCart$.next([...currentCartItems, newCartItem]);
  }

  private updateCartState() {
    const currentCartItems = this.dataStateService.cardsInMyCart$.value || [];
    const updatedCartItems = currentCartItems.map((item: ICartItem) => {
      if ((item.product?.id || item.id) === this.data?.id) {
        return { ...item, quantity: this.cartQuantity };
      }
      return item;
    });
    this.dataStateService.cardsInMyCart$.next(updatedCartItems);
  }

  private removeFromCartState() {
    const currentCartItems = this.dataStateService.cardsInMyCart$.value || [];
    const updatedCartItems = currentCartItems.filter((item: ICartItem) => 
      (item.product?.id || item.id) !== this.data?.id
    );
    this.dataStateService.cardsInMyCart$.next(updatedCartItems);
  }

  getBackUrl(): string {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/tabs/cart/')) {
      return '/tabs/cart';
    } else if (currentUrl.includes('/tabs/all/')) {
      return '/tabs/all';
    } else {
      return '/tabs/all'; // По умолчанию
    }
  }

  async deleteProduct(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (!this.data) return;

    const modal = await this.modalController.create({
      component: ConfirmationModalComponent,
      componentProps: {
        title: 'Подтверждение удаления',
        message: `Вы уверены, что хотите удалить товар "${this.data.name}"?`,
        productName: this.data.name,
        confirmText: 'Удалить',
        cancelText: 'Отмена'
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.confirmed) {
      this.productsApiService.deleteProduct(this.data!.id).subscribe({
        next: () => {
          // Удаляем из всех списков
          const currentMyCards = this.dataStateService.myCards$.value || [];
          this.dataStateService.myCards$.next(
            currentMyCards.filter(item => item.id !== this.data?.id)
          );
          
          const currentAllProducts = this.dataStateService.all$.value || [];
          this.dataStateService.all$.next(
            currentAllProducts.filter(item => item.id !== this.data?.id)
          );
          
          // Возвращаемся на главную страницу
          this.router.navigate(['/tabs/all']);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }
}
