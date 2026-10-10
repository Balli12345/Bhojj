import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bhojj.customer',
  appName: 'BHOJJ Customer',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
    backgroundColor: '#ffffff'
  }
};

export default config;
