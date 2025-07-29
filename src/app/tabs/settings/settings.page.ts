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
  IonToggle,
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
import { Preferences } from '@capacitor/preferences';
import { FormsModule } from '@angular/forms';

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
    IonToggle,
    FormsModule,
  ],
})
export class SettingsPage {
  isDarkMode = false;

  constructor() {
    addIcons({
      personCircleOutline,
      heartOutline,
      shieldCheckmarkOutline,
      informationCircleOutline,
    });
    this.loadThemePreference();
  }

  async loadThemePreference() {
    const { value } = await Preferences.get({ key: 'theme' });
    this.isDarkMode = value === 'dark';
    this.applyTheme();
  }

  async toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    await Preferences.set({ 
      key: 'theme', 
      value: this.isDarkMode ? 'dark' : 'light' 
    });
    this.applyTheme();
  }

  async onThemeChange(event: any) {
    this.isDarkMode = event.detail.checked;
    await Preferences.set({ 
      key: 'theme', 
      value: this.isDarkMode ? 'dark' : 'light' 
    });
    this.applyTheme();
  }

  private applyTheme() {
    const body = document.body;
    if (this.isDarkMode) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }
}
