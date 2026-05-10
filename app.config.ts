import "ts-node/register";
import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Beans on TV",
  description: "Watch Rocket Beans TV on your Android or Apple TV",
  slug: "beans-on-tv",
  owner: "pmk1c",
  version: "2.0.0",
  updates: {
    url: "https://u.expo.dev/cd14a3c2-29e3-4d1b-a125-1ead1060a130",
  },
  runtimeVersion: {
    policy: "fingerprint",
  },
  githubUrl: "https://github.com/pmk1c/beans-on-tv",
  backgroundColor: "#000000",
  primaryColor: "#ED0000",
  scheme: "beansontv",
  plugins: [
    [
      "@react-native-tvos/config-tv",
      {
        isTv: true,
        tvosDeploymentTarget: "15.1",
        androidTvRequired: true,
        androidTVBanner: "assets/icons/android-banner.png",
        appleTVImages: {
          icon: "./assets/icons/ios-app-icon.png",
          iconSmall: "./assets/icons/ios-app-icon-small.png",
          iconSmall2x: "./assets/icons/ios-app-icon-small-2x.png",
          topShelf: "./assets/icons/ios-top-shelf.png",
          topShelf2x: "./assets/icons/ios-top-shelf-2x.png",
          topShelfWide: "./assets/icons/ios-top-shelf-wide.png",
          topShelfWide2x: "./assets/icons/ios-top-shelf-wide-2x.png",
        },
      },
    ],
    [
      "expo-font",
      {
        fonts: [
          "./assets/fonts/rbtvIcons.ttf",
          "./assets/fonts/Archivo-VariableFont_wdth,wght.ttf",
        ],
      },
    ],
    "expo-router",
    [
      "@sentry/react-native/expo",
      {
        url: "https://sentry.io/",
        project: "beans-on-tv",
        organization: "ruben-grimm",
      },
    ],
    ["expo-secure-store"],
  ],
  splash: {
    backgroundColor: "#000000",
  },
  android: {
    package: "de.bmind.rbscvca",
  },
  ios: {
    bundleIdentifier: "de.bmind.rbscvca",
    config: {
      usesNonExemptEncryption: false,
    },
  },
  extra: {
    eas: {
      projectId: "cd14a3c2-29e3-4d1b-a125-1ead1060a130",
    },
  },
  experiments: {
    typedRoutes: true,
  },
};

export default config;
