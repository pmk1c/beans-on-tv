import { setDefaultOptions } from "date-fns";
import { Stack } from "expo-router/stack";
import { TVEventControl } from "react-native";
import * as Sentry from "@sentry/react-native";
import { de } from "date-fns/locale";
import { Provider } from "react-redux";

import { store } from "../core/redux/store";
import InitializeAppGate from "../features/initializeApp/InitializeAppGate";
import color from "../core/styles/tokens/color";

Sentry.init({
  dsn: "https://60db18e3490142bdab575ef0b3727906@o4504708985847808.ingest.sentry.io/4505467350810624",
  enabled: !__DEV__,
  tracesSampleRate: __DEV__ ? 1.0 : 0.2,
  integrations: [Sentry.reactNativeTracingIntegration(), Sentry.reactNavigationIntegration()],
});

setDefaultOptions({ locale: de });

function Layout() {
  return (
    <Provider store={store}>
      <InitializeAppGate>
        <Stack
          screenListeners={{
            state: (event) => {
              // Disable TV menu key handling of React Native on home screen, so that the app closes on press.
              if (event.data.state.routes.length === 1) {
                TVEventControl.disableTVMenuKey();
              } else {
                TVEventControl.enableTVMenuKey();
              }
            },
          }}
          screenOptions={{
            contentStyle: {
              backgroundColor: color.black,
            },
            headerShown: false,
          }}
        />
      </InitializeAppGate>
    </Provider>
  );
}

export default Sentry.wrap(Layout);
