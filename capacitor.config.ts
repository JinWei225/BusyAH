import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.busyah.mobi',
  appName: 'BusyAH',
  webDir: 'public',
  server: {
    url: 'https://busy-ah.vercel.app',
    cleartext: true,
    allowNavigation: ['*.vercel.app']
  }
};

export default config;
