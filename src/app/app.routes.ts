import { Routes } from '@angular/router';
import { RemoteLoginComponent } from './entities/auth/remote-login/remote-login.component';
import { RemoteLoginBackComponent } from './entities/auth/remote-login-back/remote-login-back.component';
import { RemoteLoginTargetComponent } from './entities/auth/remote-login-target/remote-login-target.component';
import { CreateCardPageComponent } from './tabs/create-card-page/create-card-page.component';
import { LoginPage } from './entities/auth/email/login/login.page';
import { SignupPage } from './entities/auth/email/signup/signup.page';
import { ConfirmEmailComponent } from './entities/auth/email/confirm-email/confirm-email.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs/tabs.routes').then((m) => m.tabsRoutes),
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
    path: 'remote-login-target',
    component: RemoteLoginTargetComponent,
    pathMatch: 'full',
  },
  {
    path: 'create-card',
    component: CreateCardPageComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full',
  },
  {
    path: 'email-login',
    component: LoginPage,
    pathMatch: 'full',
  },
  {
    path: 'email-signup',
    component: SignupPage,
    pathMatch: 'full',
  },
  {
    path: 'email-confirm',
    component: ConfirmEmailComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
