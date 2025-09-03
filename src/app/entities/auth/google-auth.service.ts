import { Injectable } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private isInitialized = false;

  constructor(private platform: Platform) {}

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      if (isPlatform('capacitor')) {
        await this.platform.ready();
      } else {
        // Для веб-платформы добавляем задержку
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      GoogleAuth.initialize();
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing Google Auth:', error);
      // Попробуем еще раз через некоторое время
      if (!this.isInitialized) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
          GoogleAuth.initialize();
          this.isInitialized = true;
        } catch (retryError) {
          console.error('Google Auth initialization failed on retry:', retryError);
          throw retryError;
        }
      }
    }
  }

  async signIn(): Promise<any> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const user = await GoogleAuth.signIn();
      return user;
    } catch (error) {
      console.error('Google sign in failed:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await GoogleAuth.signOut();
    } catch (error) {
      console.error('Google sign out failed:', error);
      throw error;
    }
  }
} 