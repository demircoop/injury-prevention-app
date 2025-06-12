export default {
  expo: {
    name: "injury-prevention-app",
    slug: "injury-prevention-app",
    version: "1.0.0",
    orientation: "portrait",
    jsEngine: "jsc",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: "com.demircoop.fitguard",
      supportsTablet: true,
      buildNumber: "1.0.0",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSUserNotificationUsageDescription: "This app would like to send you notifications about injury prevention and reminders."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.demircoop.fitguard",
      versionCode: 1,
      permissions: []
    },
    web: {
      favicon: "./assets/favicon.png"
    },
plugins: [
  "expo-router",
  "expo-font",
  "expo-web-browser"
],
extra: {
  eas: {
    projectId: "592f5640-6b64-4737-a524-979e61343f5e"
  }
}
  }
};
// Add privacy policy when available:
// privacy: "public",
// privacyPolicyUrl: "https://your-privacy-policy-url.com"