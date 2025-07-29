import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonText,
} from '@ionic/angular/standalone';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmailService } from '../email.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
  imports: [
    IonText,
    IonButton,
    IonLabel,
    IonContent,
    IonToolbar,
    IonTitle,
    FormsModule,
    ReactiveFormsModule,
    IonHeader,
    CommonModule,
  ],
})
export class ConfirmEmailComponent implements OnInit {
  code = new FormControl('');

  constructor(public emailService: EmailService) {}

  ngOnInit() {}
}
