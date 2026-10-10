import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bhojj.restaurant',
  appName: 'BHOJJ Restaurant',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
    backgroundColor: '#ffffff'
  }
};

export default config;
