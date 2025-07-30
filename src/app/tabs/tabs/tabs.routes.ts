import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../../guards/auth.guard';

export const tabsRoutes: Routes = [
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
        canActivate: [AuthGuard],
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
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('../my-cards/my-cards.page').then((c) => c.MyCardsPage),
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../settings/settings.page').then((c) => c.SettingsPage),
          },
          {
            path: 'my-data',
            canActivate: [AuthGuard],
            loadComponent: () =>
              import('../../pages/settings-pages/my-data/my-data.page').then(
                (m) => m.MyDataPage
              ),
          },
          {
            path: 'admin',
            canActivate: [AuthGuard],
            loadComponent: () =>
              import('../../pages/settings-pages/admin/admin.page').then(
                (m) => m.AdminPage
              ),
          },
          {
            path: 'favorites',
            canActivate: [AuthGuard],
            loadComponent: () =>
              import(
                '../../pages/settings-pages/favorites/favorites.page'
              ).then((m) => m.FavoritesPage),
          },
          {
            path: 'info',
            loadComponent: () =>
              import('../../pages/settings-pages/info/info.page').then(
                (m) => m.InfoPage
              ),
          },
        ],
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
    redirectTo: '/tabs/all',
    pathMatch: 'full',
  },
];
