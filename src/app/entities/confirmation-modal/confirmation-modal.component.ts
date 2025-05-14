import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  IonToolbar,
  IonTitle,
  IonContent,
  IonRow,
  IonButton,
  IonCol,
  IonHeader,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  imports: [
    IonHeader,
    IonCol,
    IonButton,
    IonRow,
    IonContent,
    IonToolbar,
    IonTitle,
    CommonModule,
  ],
})
export class ConfirmationModalComponent {
  @Input() message!: string; // Сообщение для отображения в модальном окне
  @Input() productName?: string; // Имя продукта, если имеется

  constructor(private modalCtrl: ModalController) {}

  confirm() {
    this.modalCtrl.dismiss({ confirmed: true }); // Закрываем модальное окно с подтверждением
  }

  cancel() {
    this.modalCtrl.dismiss(); // Закрываем модальное окно без подтверждения
  }
}
