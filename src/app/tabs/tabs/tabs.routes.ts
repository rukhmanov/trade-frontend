import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const tokenFromStorageExists = !!localStorage.getItem('token');

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'all',
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('../all/all.page').then((m) => m.AllPage),
          },
          {
            path: ':id',
            pathMatch: 'full',
            loadComponent: () =>
              import('../../pages/card-page/card-page.component').then(
                (c) => c.CardPageComponent
              ),
          },
        ],
      },
      {
        path: 'cart',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../cart/cart.page').then((c) => c.CartPage),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('../../pages/card-page/card-page.component').then(
                (c) => c.CardPageComponent
              ),
          },
        ],
      },
      {
        path: 'my-cards',
        loadComponent: () =>
          import('../my-cards/my-cards.page').then((c) => c.MyCardsPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../settings/settings.page').then((c) => c.SettingsPage),
      },
      {
        path: '',
        redirectTo: '/tabs/all',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: tokenFromStorageExists ? '/tabs/all' : '/tabs/settings',
    pathMatch: 'full',
  },
];
