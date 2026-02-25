import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.busyah.mobi',
  appName: 'BusyAH',
  webDir: 'public',
  server: {
    url: 'https://busyah-your-vercel-domain.vercel.app',
    cleartext: true
  }
};

export default config;
