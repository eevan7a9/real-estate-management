export const environment = {
  production: true,
  api: {
    server: 'http://localhost:8000/',
    mapKey: '',
    googleAuthClientId: '',
    webSocketUrl: '',
  },
  map: {
    tiles: {
      default: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      dark: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    },
  },
  features: {
    demoMode: false,
    demoRestrictedMessage: 'This feature is restricted in demo mode.',
  },
};
