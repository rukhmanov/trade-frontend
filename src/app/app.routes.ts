import { Routes } from '@angular/router';
import { RemoteLoginBackComponent } from './entities/auth/remote-login-back/remote-login-back.component';
import { CreateCardPageComponent } from './tabs/create-card-page/create-card-page.component';
import { LoginPage } from './entities/auth/email/login/login.page';
import { SignupPage } from './entities/auth/email/signup/signup.page';
import { ConfirmEmailComponent } from './entities/auth/email/confirm-email/confirm-email.component';
import { UniversalAuthComponent } from './entities/auth/universal-auth/universal-auth.component';
import { AuthCallbackComponent } from './entities/auth/auth-callback/auth-callback.component';
import { TestAuthComponent } from './entities/auth/test-auth/test-auth.component';
import { AuthGuard } from './guards/auth.guard';
import { PaymentPage } from './pages/payment/payment.page';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs/tabs.routes').then((m) => m.tabsRoutes),
  },
  {
    path: 'remote-login-back',
    component: RemoteLoginBackComponent,
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
    path: 'auth',
    component: UniversalAuthComponent,
    pathMatch: 'full',
  },
  {
    path: 'auth/callback',
    component: AuthCallbackComponent,
    pathMatch: 'full',
  },
  {
    path: 'test-auth',
    component: TestAuthComponent,
    pathMatch: 'full',
  },
  {
    path: 'payment',
    component: PaymentPage,
    canActivate: [AuthGuard],
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
