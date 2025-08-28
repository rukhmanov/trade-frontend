import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack, cardOutline, checkmarkCircleOutline } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonNote,
  IonButton as IonButtonComponent,
  IonText
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonNote,
    IonButtonComponent,
    IonText
  ]
})
export class PaymentPage {
  constructor(private router: Router) {
    addIcons({
      arrowBack,
      cardOutline,
      checkmarkCircleOutline
    });
  }

  goBack() {
    this.router.navigate(['/tabs/cart']);
  }

  processPayment() {
    // Здесь будет логика обработки платежа
    console.log('Обработка платежа...');
    // После успешной оплаты можно перенаправить на другую страницу
    // this.router.navigate(['/tabs/all']);
  }
}
