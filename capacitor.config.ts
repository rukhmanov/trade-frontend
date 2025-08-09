import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.parsifal.app',
  appName: 'parsifal',
  webDir: 'www',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '81877849768-6aqduma3kni83ss7rgtaaco97qjjv2qn.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
