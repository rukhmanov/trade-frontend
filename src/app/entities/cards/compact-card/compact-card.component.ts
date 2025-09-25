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
  ModalController,
} from '@ionic/angular/standalone';
import { PriceFormatPipe } from '../../../pipes/price-format.pipe';
import { CurrencySymbolPipe } from '../../../pipes/currency-symbol.pipe';
import { heart, add, remove, trash } from 'ionicons/icons';
import { IProduct, ICartItem, ILikeItem, ILikeActionResponse } from '../types';
import { IUser } from '../../auth/types';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { addIcons } from 'ionicons';
import { CommonStateService } from 'src/app/state/common-state.service';
import { ProductsApiService } from './services/cards-api.service';
import { DataStateService } from 'src/app/state/data-state.service';
import { UserStateService } from 'src/app/state/user-state.service';
import { ConfirmationModalComponent } from '../../confirmation-modal';
import { ImageSliderComponent } from '../../image-slider/image-slider.component';

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
    PriceFormatPipe,
    CurrencySymbolPipe,
    ImageSliderComponent,
  ],
})
export class CompactCardComponent implements OnInit {
  s3 = environment.s3;
  isInCart = false;
  cartQuantity = 0;
  isLiked = false;
  isOwnProduct = false;
  images: string[] = [];

  @Input() data: IProduct | null = null;
  @Input() hideButtons = false; // Новый input для скрытия кнопок
  @Input() showDeleteButton = false; // Новый input для показа кнопки удаления

  // Геттер для отслеживания изменений в data
  get currentData(): IProduct | null {
    return this.data;
  }
  
  constructor(
    private router: Router,
    private commonStateService: CommonStateService,
    private productsApiService: ProductsApiService,
    private dataStateService: DataStateService,
    private userStateService: UserStateService,
    private modalController: ModalController
  ) {
    addIcons({
      heart,
      add,
      remove,
      trash,
    });
  }

  ngOnInit() {
    this.checkCartStatus();
    this.checkLikeStatus();
    this.checkOwnership();
    this.prepareImages();
    
    // Подписываемся на изменения в корзине
    this.dataStateService.cardsInMyCart$.subscribe(() => {
      this.checkCartStatus();
    });

    // Подписываемся на изменения в лайках
    this.dataStateService.likedProducts$.subscribe(() => {
      this.checkLikeStatus();
    });
  }

  ngOnChanges() {
    // Вызываем prepareImages при изменении данных
    this.prepareImages();
  }

  private checkCartStatus() {
    if (!this.data) return;
    
    const cartItems: any[] | null = this.dataStateService.cardsInMyCart$.value;
    if (Array.isArray(cartItems)) {
      // Проверяем новый формат (CartItem)
      let cartItem = cartItems.find((item: any) => item.product?.id === this.data?.id);
      
      // Если не найден в новом формате, проверяем старый формат (Product)
      if (!cartItem) {
        cartItem = cartItems.find((item: any) => item.id === this.data?.id);
      }
      
      this.isInCart = !!cartItem;
      this.cartQuantity = cartItem?.quantity || 1; // По умолчанию 1 для старого формата
    }
  }

  navigate() {
    this.commonStateService.pendingByTime();
    this.router.navigate(['tabs', 'all', this.data?.id]);
  }

  private checkLikeStatus() {
    if (!this.data) return;
    
    const likedProducts: ILikeItem[] | null = this.dataStateService.likedProducts$.value;
    if (Array.isArray(likedProducts)) {
      const likedItem = likedProducts.find((item: ILikeItem) => item.product.id === this.data?.id);
      this.isLiked = !!likedItem;
    } else {
      // Если лайки еще не загружены, устанавливаем false
      this.isLiked = false;
    }
  }

  like(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.data) {
      this.productsApiService.like(this.data.id).subscribe((response: ILikeActionResponse) => {
        // Обновляем состояние лайков после действия
        this.updateLikesState(response.data.liked);
      });
    }
  }

  private updateLikesState(liked: boolean) {
    const currentLikes = this.dataStateService.likedProducts$.value || [];
    
    if (liked) {
      // Добавляем лайк
      const newLike: ILikeItem = {
        id: Math.random(), // Временный ID
        productId: this.data!.id,
        userId: 1, // Временный ID пользователя
        product: this.data!,
        createdAt: new Date().toISOString()
      };
      this.dataStateService.likedProducts$.next([...currentLikes, newLike]);
    } else {
      // Удаляем лайк
      const updatedLikes = currentLikes.filter(like => like.product.id !== this.data!.id);
      this.dataStateService.likedProducts$.next(updatedLikes);
    }
    
    this.checkLikeStatus();
  }

  buy(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.data) {
      this.productsApiService.addProductsToCart(this.data.id, 1).subscribe(() => {
        this.addToCartState();
      });
    }
  }

  private addToCartState() {
    const currentCart = this.dataStateService.cardsInMyCart$.value || [];
    
    // Проверяем, есть ли уже этот товар в корзине
    const existingItem = currentCart.find(item => 
      item.product?.id === this.data?.id || item.id === this.data?.id
    );

    if (existingItem) {
      // Если товар уже в корзине, увеличиваем количество
      const updatedCart = currentCart.map(item => {
        if (item.product?.id === this.data?.id || item.id === this.data?.id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      this.dataStateService.cardsInMyCart$.next(updatedCart);
    } else {
      // Если товара нет в корзине, добавляем новый
      const newCartItem = {
        id: Math.random(), // Временный ID
        productId: this.data!.id,
        userId: 1, // Временный ID пользователя
        product: this.data!,
        quantity: 1
      };
      this.dataStateService.cardsInMyCart$.next([...currentCart, newCartItem]);
    }
    
    this.checkCartStatus();
  }

  increaseQuantity(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.data) {
      const newQuantity = this.cartQuantity + 1;
      this.productsApiService.updateCartQuantity(this.data.id, newQuantity).subscribe(() => {
        this.updateCartState(newQuantity);
      });
    }
  }

  decreaseQuantity(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.data && this.cartQuantity > 1) {
      const newQuantity = this.cartQuantity - 1;
      this.productsApiService.updateCartQuantity(this.data.id, newQuantity).subscribe(() => {
        this.updateCartState(newQuantity);
      });
    } else if (this.data && this.cartQuantity === 1) {
      // Если количество станет 0, удаляем из корзины
      this.productsApiService.removeFromCart(this.data.id).subscribe(() => {
        this.removeFromCartState();
      });
    }
  }

  private updateCartState(newQuantity: number) {
    const currentCart = this.dataStateService.cardsInMyCart$.value || [];
    const updatedCart = currentCart.map(item => {
      if (item.product?.id === this.data?.id || item.id === this.data?.id) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    this.dataStateService.cardsInMyCart$.next(updatedCart);
    this.checkCartStatus();
  }

  private removeFromCartState() {
    const currentCart = this.dataStateService.cardsInMyCart$.value || [];
    const updatedCart = currentCart.filter(item => 
      (item.product?.id !== this.data?.id && item.id !== this.data?.id)
    );
    this.dataStateService.cardsInMyCart$.next(updatedCart);
    this.checkCartStatus();
  }

  private prepareImages() {
    if (this.data?.photos) {
      this.images = this.data.photos;
    } else {
      this.images = [];
    }
  }

  private checkOwnership() {
    if (!this.data) return;
    
    const currentUser: IUser | null = this.userStateService.me$.value;
    if (!currentUser || !this.data.user) return;
    
    // Проверяем, является ли текущий пользователь владельцем товара
    // Используем email для сравнения, так как это уникальное поле
    this.isOwnProduct = currentUser.email === this.data.user.email;
  }

  async deleteProduct(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (this.data) {
      const modal = await this.modalController.create({
        component: ConfirmationModalComponent,
        componentProps: {
          title: 'Подтверждение удаления',
          message: 'Вы уверены, что хотите удалить этот товар?',
          productName: this.data.name,
          confirmText: 'Удалить',
          cancelText: 'Отмена',
        },
      });
      await modal.present();

      const { data } = await modal.onDidDismiss();

      if (data?.confirmed) {
        if (this.data) {
          this.productsApiService.deleteProduct(this.data.id).subscribe(() => {
            // Удаляем товар из списка моих товаров
            const currentMyCards = this.dataStateService.myCards$.value || [];
            const updatedMyCards = currentMyCards.filter(item => item.id !== this.data?.id);
            this.dataStateService.myCards$.next(updatedMyCards);
            
            // Также удаляем из всех товаров, если он там есть
            const currentAllProducts = this.dataStateService.all$.value || [];
            const updatedAllProducts = currentAllProducts.filter(item => item.id !== this.data?.id);
            this.dataStateService.all$.next(updatedAllProducts);
          });
        }
      }
    }
  }
}
