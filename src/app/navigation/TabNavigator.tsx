import createTVTopTabNavigator from "./createTVTopTabNavigator";
import AuthScreen from "../../features/auth/AuthScreen";
import LatestVideosScreen from "../../features/latestVideos/LatestVideosScreen";

export type TabParamList = {
  LatestVideos: undefined;
  Auth: undefined;
};

const Tab = createTVTopTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="LatestVideos"
        component={LatestVideosScreen}
        options={{ title: "Neueste Videos" }}
      />
      <Tab.Screen
        name="Auth"
        component={AuthScreen}
        options={{ icon: "user_circle" }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
