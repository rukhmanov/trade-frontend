// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  base: 'http://localhost:3000/',
  // base: 'https://rukhmanov-trade-backend-f011.twc1.net/',
  frondProdHost: 'http://localhost:8100/',
  yandexClientId: '14e2cce0ee3743fe8f1e0da062f95200',
  s3: 'https://1f48199c-files.s3.twcstorage.ru/',
  firebase: {
    apiKey: 'AIzaSyCuCt3L62O9pvNsyGdkbn9lPHEnszvMb9A',
    authDomain: 'parsifal-3478e.firebaseapp.com',
    projectId: 'parsifal-3478e',
    storageBucket: 'parsifal-3478e.firebasestorage.app',
    messagingSenderId: '402456930037',
    appId: '1:402456930037:web:e15968953a88041d0307bc',
    measurementId: 'G-ZZCF0DRJXL',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
