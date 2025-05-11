import { Routes } from '@angular/router';
import { AuthComponent } from './entities/auth/auth.component';
import { RemoteLoginComponent } from './entities/auth/remote-login/remote-login.component';
import { RemoteLoginBackComponent } from './entities/auth/remote-login-back/remote-login-back.component';
import { RemoteLoginTargetComponent } from './entities/auth/remote-login-target/remote-login-target.component';
import { CreateEventPageComponent } from './pages/create-event-page/create-event-page.component';

export const routes: Routes = [
  {
    path: '',
    // pathMatch: 'full',
    loadChildren: () => import('./tabs/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'auth',
    component: AuthComponent,
    pathMatch: 'full',
  },
  {
    path: 'remote-login',
    component: RemoteLoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'remote-login-back',
    component: RemoteLoginBackComponent,
    pathMatch: 'full',
  },
  {
    path: 'remote-login-target/:token',
    component: RemoteLoginTargetComponent,
    pathMatch: 'full',
  },
  {
    path: 'create-event',
    component: CreateEventPageComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
