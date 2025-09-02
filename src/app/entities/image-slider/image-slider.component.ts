import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { IonIcon } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./image-slider.component.scss'],
  imports: [CommonModule, IonIcon],
  standalone: true,
})
export class ImageSliderComponent implements OnInit, AfterViewInit, OnDestroy {
  s3 = environment.s3;

  @Input() images: string[] = [];
  @Input() maxHeight: string = '300px';
  @Input() aspectRatio: string = '16/9';
  @Input() showPagination: boolean = true;
  @Input() showNavigation: boolean = true;
  @Input() autoPlay: boolean = false;
  @Input() autoPlayDelay: number = 3000;
  @Input() loop: boolean = true;

  @ViewChild('swiperContainer') swiperContainer!: ElementRef;

  swiperModules = [IonicSlides];
  currentSlideIndex = 0;
  private autoPlayInterval: any;
  private mutationObserver: MutationObserver | null = null;

  constructor() {}

  ngOnInit(): void {
    // Инициализация компонента
  }

  ngAfterViewInit(): void {
    // Инициализируем текущий индекс и добавляем слушатели событий
    setTimeout(() => {
      this.updateCurrentSlideIndex();
      this.addSwiperEventListeners();
    }, 100);
    
    if (this.autoPlay && this.images.length > 1) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
    this.removeSwiperEventListeners();
  }

  onSlideChange(event: any): void {
    console.log('Slide change event:', event);
    
    // Попробуем разные способы получения activeIndex
    if (event && event.detail && event.detail[0]) {
      this.currentSlideIndex = event.detail[0].activeIndex;
    } else if (event && event.detail && event.detail.activeIndex !== undefined) {
      this.currentSlideIndex = event.detail.activeIndex;
    } else if (event && event.target && event.target.swiper) {
      this.currentSlideIndex = event.target.swiper.activeIndex;
    } else if (event && event.activeIndex !== undefined) {
      this.currentSlideIndex = event.activeIndex;
    }
    
    // Если не удалось получить индекс из события, попробуем получить его напрямую из swiper
    if (this.currentSlideIndex === undefined || this.currentSlideIndex === null) {
      this.updateCurrentSlideIndex();
    }
    
    console.log('Current slide index updated to:', this.currentSlideIndex);
  }

  private updateCurrentSlideIndex(): void {
    if (this.swiperContainer?.nativeElement) {
      const swiper = this.swiperContainer.nativeElement.swiper;
      if (swiper) {
        this.currentSlideIndex = swiper.activeIndex;
      }
    }
  }

  private addSwiperEventListeners(): void {
    if (this.swiperContainer?.nativeElement) {
      const swiper = this.swiperContainer.nativeElement.swiper;
      if (swiper) {
        // Добавляем слушатели событий напрямую к swiper
        swiper.on('slideChange', () => {
          this.currentSlideIndex = swiper.activeIndex;
          console.log('Swiper slideChange event, index:', this.currentSlideIndex);
        });
        
        swiper.on('slideChangeTransitionEnd', () => {
          this.currentSlideIndex = swiper.activeIndex;
          console.log('Swiper slideChangeTransitionEnd event, index:', this.currentSlideIndex);
        });

        // Добавляем MutationObserver для отслеживания изменений класса active
        this.setupMutationObserver();
      }
    }
  }

  private setupMutationObserver(): void {
    if (this.swiperContainer?.nativeElement) {
      this.mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const target = mutation.target as HTMLElement;
            if (target.classList.contains('swiper-slide-active')) {
              // Находим индекс активного слайда
              const slides = this.swiperContainer?.nativeElement.querySelectorAll('.swiper-slide');
              if (slides) {
                for (let i = 0; i < slides.length; i++) {
                  if (slides[i].classList.contains('swiper-slide-active')) {
                    this.currentSlideIndex = i;
                    console.log('MutationObserver detected active slide:', this.currentSlideIndex);
                    break;
                  }
                }
              }
            }
          }
        });
      });

      this.mutationObserver.observe(this.swiperContainer.nativeElement, {
        attributes: true,
        attributeFilter: ['class'],
        subtree: true
      });
    }
  }

  private removeSwiperEventListeners(): void {
    if (this.swiperContainer?.nativeElement) {
      const swiper = this.swiperContainer.nativeElement.swiper;
      if (swiper) {
        swiper.off('slideChange');
        swiper.off('slideChangeTransitionEnd');
      }
    }
    
    // Отключаем MutationObserver
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
  }
  goToSlide(index: number, event?: Event): void {
    // Предотвращаем всплытие события, чтобы не сработал переход по роуту
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (this.swiperContainer?.nativeElement) {
      const swiper = this.swiperContainer.nativeElement.swiper;
      if (swiper) {
        swiper.slideTo(index);
        this.currentSlideIndex = index;
      }
    }
  }

  nextSlide(): void {
    if (this.swiperContainer?.nativeElement) {
      const swiper = this.swiperContainer.nativeElement.swiper;
      if (swiper && this.images.length > 1) {
        swiper.slideNext();
        // Обновляем индекс после переключения
        setTimeout(() => {
          this.updateCurrentSlideIndex();
        }, 100);
      }
    }
  }

  prevSlide(): void {
    if (this.swiperContainer?.nativeElement) {
      const swiper = this.swiperContainer.nativeElement.swiper;
      if (swiper && this.images.length > 1) {
        swiper.slidePrev();
        // Обновляем индекс после переключения
        setTimeout(() => {
          this.updateCurrentSlideIndex();
        }, 100);
      }
    }
  }

  private startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  onImageLoad(event: any): void {
    // Обработка загрузки изображения
    const img = event.target;
    img.style.opacity = '1';
  }

  onImageError(event: any): void {
    // Обработка ошибки загрузки изображения
    const img = event.target;
    img.src = 'assets/images/card-image.png';
  }
}
