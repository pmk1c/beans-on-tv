import "ts-node/register";
import { ExpoConfig } from "expo/config";

import withTvConfig from "./config/withTvConfig";

const config: ExpoConfig = {
  name: "Beans on TV",
  description: "Watch Rocket Beans TV on your Android or Apple TV",
  slug: "beans-on-tv",
  privacy: "hidden",
  version: "2.0.0",
  updates: {
    url: "https://u.expo.dev/cd14a3c2-29e3-4d1b-a125-1ead1060a130",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  githubUrl: "https://github.com/pmk1c/rbscvca-app",
  backgroundColor: "#000000",
  primaryColor: "#ED0000",
  plugins: [
    [
      "@react-native-tvos/config-tv",
      {
        isTv: true,
        showVerboseWarnings: true,
      },
    ],
    [
      "expo-font",
      {
        fonts: ["./assets/fonts/rbtvIcons.ttf", "./assets/fonts/Rubik.ttf"],
      },
    ],
    [
      "@sentry/react-native/expo",
      {
        url: "https://sentry.io/",
        authToken:
          "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",
        project: "rbscvca-app",
        organization: "ruben-grimm",
      },
    ],
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
};

export default withTvConfig(config, {
  android: {
    banner: "assets/android-banner.png",
  },
  ios: {
    brandassets: "assets/tvos.brandassets",
  },
});
