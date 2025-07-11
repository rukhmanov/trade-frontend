import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  IonModal,
  IonContent,
  ModalController,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, IonModal, CommonModule],
})
export class ImageGalleryComponent {
  images: string[] = [];
  @Input() set imageFiles(files: File[]) {
    if (!files?.length) return;
    this.changePhotos(structuredClone(files));
  }

  isModalOpen = false;
  currentIndex = 0;

  constructor(private modalCtrl: ModalController) {}

  openModal(index: number): void {
    this.currentIndex = index;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  deleteImage(index: number): void {
    this.images.splice(index, 1);
    if (this.currentIndex >= this.images.length) {
      this.currentIndex = this.images.length - 1; // Обновить индекс, если изображение было удалено
    }
  }

  swipeLeft(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  swipeRight(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  changePhotos(files: File[]) {
    this.images = [];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.images.push(reader.result as string);
      files.shift();
      if (files.length) {
        reader.readAsDataURL(files[0]);
      }
    };
    reader.readAsDataURL(files[0]);
  }
}
