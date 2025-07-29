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
  constructor(private router: Router, private zone: NgZone, private commonStateService: CommonStateService) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        console.log('Переход на:', event.url);
        console.log('Предыдущий URL:', event.urlAfterRedirects);
      });
    this.initializeApp();
  }

  initializeApp() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      console.log('event ==> ', event);
      this.zone.run(() => {
        const domain = 'parsifal.com';

        const pathArray = event.url.split(domain);
        // The pathArray is now like ['https://devdactic.com', '/details/42']

        // Get the last element with pop()
        const appPath = pathArray.pop();
        if (appPath) {
          this.router.navigateByUrl(appPath);
        }
      });
    });
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      // Any calls to load data go here
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }
}
