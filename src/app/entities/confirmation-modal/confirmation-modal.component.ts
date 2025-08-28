import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import {
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonHeader,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonButton,
    IonContent,
    IonToolbar,
    IonTitle,
    CommonModule,
  ],
  providers: [ModalController],
})
export class ConfirmationModalComponent {
  @Input() title: string = 'Подтверждение'; // Заголовок модального окна
  @Input() message!: string; // Сообщение для отображения в модальном окне
  @Input() productName?: string; // Имя продукта, если имеется
  @Input() confirmText: string = 'Да'; // Текст кнопки подтверждения
  @Input() cancelText: string = 'Нет'; // Текст кнопки отмены

  constructor(private modalCtrl: ModalController) {}

  confirm() {
    this.modalCtrl.dismiss({ confirmed: true }); // Закрываем модальное окно с подтверждением
  }

  cancel() {
    this.modalCtrl.dismiss(); // Закрываем модальное окно без подтверждения
  }
}
