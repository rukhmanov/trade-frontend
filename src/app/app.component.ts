import { Component, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import {
  IonApp,
  IonRouterOutlet,
  IonContent,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { filter } from 'rxjs';
import { register } from 'swiper/element/bundle';
import { CommonStateService } from './state/common-state.service';
import { DataStateService } from './state/data-state.service';
import { ProductsApiService } from './entities/cards/compact-card/services/cards-api.service';
import { environment } from '../environments/environment';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonRefresherContent,
    IonRefresher,
    IonContent,
    IonApp,
    IonRouterOutlet,
  ],
})
export class AppComponent {
  constructor(
    private router: Router, 
    private zone: NgZone, 
    private commonStateService: CommonStateService,
    private dataStateService: DataStateService,
    private productsApiService: ProductsApiService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Log navigation for debugging (remove in production)
        if (environment.production === false) {
          console.log('Navigation to:', event.url);
          console.log('Previous URL:', event.urlAfterRedirects);
        }
      });
    this.initializeApp();
  }

  initializeApp() {
    // Загружаем лайки при старте приложения
    this.loadLikedProducts();
    
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      // Log deep link event for debugging (remove in production)
      if (environment.production === false) {
        console.log('Deep link event:', event);
      }
      
      this.zone.run(() => {
        const domain = 'parsifal.com';
        const pathArray = event.url.split(domain);
        const appPath = pathArray.pop();
        
        if (appPath) {
          this.router.navigateByUrl(appPath);
        }
      });
    });
  }

  private loadLikedProducts() {
    // Загружаем лайки при старте приложения
    this.productsApiService.getLikedProducts().subscribe(
      (response) => {
        this.dataStateService.likedProducts$.next(response.data);
      },
      (error) => {
        console.log('Ошибка загрузки лайков:', error);
      }
    );
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      // Any calls to load data go here
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }
}
