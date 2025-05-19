const config = {
  appId: "com.template.amoga",
  appName: "amogademoapp",
  webDir: "public",
  bundleWebRuntime: false,
  server: {
    url: "https://amoga-login-template.vercel.app",
    cleartext: true,
  },
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
};

export default config;
