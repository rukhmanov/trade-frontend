import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { LoadingController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class CommonStateService {
  loading: any = null;
  pending$ = new BehaviorSubject<boolean>(false);
  isDarkMode$ = new BehaviorSubject<boolean>(false);

  constructor(private loadingCtrl: LoadingController) {
    this.loadThemePreference();
    
    this.pending$
      .pipe(
        tap((resp) => {
          if (resp) {
            this.showLoading();
          } else {
            this.dismissLoading();
          }
        })
      )
      .subscribe();
  }

  async loadThemePreference() {
    try {
      const { value } = await Preferences.get({ key: 'theme' });
      const isDarkMode = value === 'dark';
      this.isDarkMode$.next(isDarkMode);
      this.applyTheme(isDarkMode);
    } catch (error) {
      console.log('No theme preference found, using light theme');
      this.isDarkMode$.next(false);
      this.applyTheme(false);
    }
  }

  async setTheme(isDarkMode: boolean) {
    this.isDarkMode$.next(isDarkMode);
    await Preferences.set({
      key: 'theme',
      value: isDarkMode ? 'dark' : 'light'
    });
    this.applyTheme(isDarkMode);
  }

  private applyTheme(isDarkMode: boolean) {
    const body = document.body;
    if (isDarkMode) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }

  dismissLoading() {
    this.loading?.dismiss();
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Подождите...',
      cssClass: 'custom-loading',
      animated: true,
    });

    this.loading.present();
  }

  pendingByTime(ms: number = 700) {
    this.pending$.next(true);
    setTimeout(() => {
      this.pending$.next(false);
    }, ms);
  }
}
