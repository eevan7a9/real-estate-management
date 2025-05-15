// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: {
    server: 'http://localhost:8000/',
    mapKey: '',
    googleAuthClientId: '',
    webSocketUrl: 'ws://localhost:8000/websocket',
  },
  map: {
    // Add the map tiles to show base on theme
    tiles: {
      default:
        'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=',
      dark: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=',
    },
  },
  features: {
    restrictedMode: false,
    restrictedHeading: 'Restricted',
    restrictedMessage: 'This feature is currently disabled in this mode.',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
