import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { TokenInterceptorService } from './app/interceptors/token-interceptor.service';
import { cacheInterceptor } from './app/interceptors/cache.interceptor';
import { errorInterceptor } from './app/interceptors/error.interceptor';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './environments/environment';
import { ThemeInitializerService } from './app/state/theme-initializer.service';

// Инициализируем тему перед запуском приложения
const themeInitializer = new ThemeInitializerService();
themeInitializer.initializeTheme();

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(withInterceptors([cacheInterceptor])),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideFirebaseApp(() => initializeApp({ ...environment.firebase })),
    provideAuth(() => getAuth()),
  ],
});
