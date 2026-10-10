import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bhojj.delivery',
  appName: 'BHOJJ Delivery',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
    backgroundColor: '#ffffff'
  }
};

export default config;
