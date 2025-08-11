import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonToggle,
} from '@ionic/angular/standalone';
import { AuthComponent } from '../../entities/auth/auth.component';
import { RouterModule } from '@angular/router';
import {
  heartOutline,
  informationCircleOutline,
  personCircleOutline,
  shieldCheckmarkOutline,
  moonOutline,
  refreshOutline,
  peopleOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';
import { CommonStateService } from '../../state/common-state.service';
import { UserStateService } from '../../state/user-state.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  imports: [
    CommonModule,
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
    IonToggle,
    FormsModule,
  ],
})
export class SettingsPage {
  isDarkMode = false;
  isLoggedIn = false;

  constructor(
    private commonStateService: CommonStateService,
    private userStateService: UserStateService
  ) {
    addIcons({
      personCircleOutline,
      heartOutline,
      shieldCheckmarkOutline,
      informationCircleOutline,
      moonOutline,
      refreshOutline,
      peopleOutline,
    });
    
    // Подписываемся на изменения темы
    this.commonStateService.isDarkMode$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
    });

    // Подписываемся на состояние авторизации
    this.userStateService.me$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  async onThemeChange(event: any) {
    const isDarkMode = event.detail.checked;
    await this.commonStateService.setTheme(isDarkMode);
  }
}
