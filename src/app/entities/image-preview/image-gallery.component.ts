import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  private _imageFiles: File[] = [];
  
  @Input() set imageFiles(files: File[]) {
    if (!files?.length) {
      this.images = [];
      this._imageFiles = [];
      return;
    }
    this._imageFiles = [...files];
    this.changePhotos([...files]);
  }
  
  get imageFiles(): File[] {
    return this._imageFiles;
  }

  @Output() imageDeleted = new EventEmitter<number>();

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
    // Удаляем изображение из локального массива
    this.images.splice(index, 1);
    
    // Удаляем соответствующий файл из массива файлов
    this._imageFiles.splice(index, 1);
    
    // Уведомляем родительский компонент об удалении
    this.imageDeleted.emit(index);
    
    // Обновляем индекс текущего изображения в модальном окне
    if (this.currentIndex >= this.images.length) {
      this.currentIndex = this.images.length - 1;
    }
    
    // Закрываем модальное окно, если больше нет изображений
    if (this.images.length === 0) {
      this.closeModal();
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
    if (!files.length) return;
    
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
