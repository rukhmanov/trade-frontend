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

  constructor() {}

  ngOnInit(): void {
    // Инициализация компонента
  }

  ngAfterViewInit(): void {
    if (this.autoPlay && this.images.length > 1) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  onSlideChange(event: any): void {
    if (event && event.detail && event.detail[0]) {
      this.currentSlideIndex = event.detail[0].activeIndex;
    }
  }

  goToSlide(index: number): void {
    if (this.swiperContainer?.nativeElement) {
      const swiper = this.swiperContainer.nativeElement.swiper;
      if (swiper) {
        swiper.slideTo(index);
      }
    }
  }

  nextSlide(): void {
    if (this.swiperContainer?.nativeElement) {
      const swiper = this.swiperContainer.nativeElement.swiper;
      if (swiper && this.images.length > 1) {
        swiper.slideNext();
      }
    }
  }

  prevSlide(): void {
    if (this.swiperContainer?.nativeElement) {
      const swiper = this.swiperContainer.nativeElement.swiper;
      if (swiper && this.images.length > 1) {
        swiper.slidePrev();
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
