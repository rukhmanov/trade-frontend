import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const tokenFromStorageExists = !!localStorage.getItem('token');

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'all-events',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../all-events/all-events.page').then(
                (m) => m.AllEventsPage
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('../../pages/event-page/event-page.component').then(
                (c) => c.EventPageComponent
              ),
          },
        ],
      },

      {
        path: 'my-events',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../my-events/my-events.page').then((c) => c.MyEventsPage),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('../../pages/event-page/event-page.component').then(
                (c) => c.EventPageComponent
              ),
          },
        ],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../settings/settings.page').then((c) => c.SettingsPage),
      },
      {
        path: '',
        redirectTo: '/tabs/all-events',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: tokenFromStorageExists ? '/tabs/all-events' : '/tabs/settings',
    pathMatch: 'full',
  },
];
