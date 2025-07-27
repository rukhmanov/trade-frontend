import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';
import { AuthComponent } from '../../entities/auth/auth.component';
import { RouterModule } from '@angular/router';
import {
  heartOutline,
  informationCircleOutline,
  personCircleOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  imports: [
    IonIcon,
    IonLabel,
    IonItem,
    IonList,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    AuthComponent,
    RouterModule,
  ],
})
export class SettingsPage {
  constructor() {
    addIcons({
      personCircleOutline,
      heartOutline,
      shieldCheckmarkOutline,
      informationCircleOutline,
    });
  }
}
