import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ThemeInitializerService {
  
  async initializeTheme(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: 'theme' });
      const isDarkMode = value === 'dark';
      this.applyTheme(isDarkMode);
    } catch (error) {
      this.applyTheme(false);
    }
  }

  private applyTheme(isDarkMode: boolean): void {
    const body = document.body;
    if (isDarkMode) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }
} 