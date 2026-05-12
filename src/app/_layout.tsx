import { setDefaultOptions } from "date-fns";
import { useFonts } from "expo-font";
import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import * as Sentry from "@sentry/react-native";
import { de } from "date-fns/locale";
import { Provider } from "react-redux";

import { store } from "../core/redux/store";
import InitializeAppGate from "../features/initializeApp/InitializeAppGate";
import color from "../core/styles/tokens/color";
import { TVEventControl } from "../core/react-native-tvos-shim";
import { useAppSelector } from "../core/redux/hooks";
import { selectAuthToken } from "../features/auth/authTokenSlice";

void SplashScreen.preventAutoHideAsync();

Sentry.init({
  dsn: "https://60db18e3490142bdab575ef0b3727906@o4504708985847808.ingest.sentry.io/4505467350810624",
  enabled: !__DEV__,
  tracesSampleRate: __DEV__ ? 1.0 : 0.2,
  integrations: [Sentry.reactNativeTracingIntegration(), Sentry.reactNavigationIntegration()],
});

setDefaultOptions({ locale: de });

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
      <InitializeAppGate>
        <RootNavigator />
      </InitializeAppGate>
    </Provider>
  );
}

function RootNavigator() {
  const token = useAppSelector(selectAuthToken);

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
        contentStyle: {
          backgroundColor: color.black,
        },
        headerShown: false,
      }}
    >
      <Stack.Protected guard={!!token}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="player/[episodeId]" />
      </Stack.Protected>
      <Stack.Protected guard={!token}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}

export default Sentry.wrap(Layout);
