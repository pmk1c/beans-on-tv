import { setDefaultOptions } from "date-fns";
import { useFonts } from "expo-font";
import { ImageBackground } from "expo-image";
import { DefaultTheme, ThemeProvider } from "expo-router";
import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import * as Sentry from "@sentry/react-native";
import { de } from "date-fns/locale";
import { Provider } from "react-redux";

import { store } from "../core/redux/store";
import InitializeAppGate from "../features/initializeApp/InitializeAppGate";
import { TVEventControl } from "../core/react-native-tvos-shim";
import { authClient } from "../lib/auth-client";

void SplashScreen.preventAutoHideAsync();

Sentry.init({
  dsn: "https://60db18e3490142bdab575ef0b3727906@o4504708985847808.ingest.sentry.io/4505467350810624",
  enabled: !__DEV__,
  tracesSampleRate: __DEV__ ? 1.0 : 0.2,
  integrations: [Sentry.reactNativeTracingIntegration(), Sentry.reactNavigationIntegration()],
});

setDefaultOptions({ locale: de });

const transparentBackgroundTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
    card: "transparent",
  },
};

function Layout() {
  const [fontsLoaded] = useFonts({
    rbtvIcons: require("../../assets/fonts/rbtvIcons.ttf"),
    "ArchivoRoman-Black": require("../../assets/fonts/Archivo-VariableFont_wdth,wght.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ImageBackground
        source={require("../core/assets/images/bg-2023.png")}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      >
        <ThemeProvider value={transparentBackgroundTheme}>
          <InitializeAppGate>
            <RootNavigator />
          </InitializeAppGate>
        </ThemeProvider>
      </ImageBackground>
    </Provider>
  );
}

function RootNavigator() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  if (isSessionPending) {
    return null;
  }

  return (
    <Stack
      screenListeners={{
        state: (event) => {
          // Disable TV menu key handling of React Native on home screen, so that the app closes on press.
          if (event.data.state.routes.length === 1) {
            TVEventControl?.disableTVMenuKey();
          } else {
            TVEventControl?.enableTVMenuKey();
          }
        },
      }}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="player/[episodeId]" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
      <Stack.Screen name="device" />
      <Stack.Screen name="device/approve" />
    </Stack>
  );
}

export default Sentry.wrap(Layout);
