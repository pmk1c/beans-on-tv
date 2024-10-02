import {
  TabRouter,
  TabActions,
  DefaultNavigatorOptions,
  ParamListBase,
  TabNavigationState,
  TabRouterOptions,
  TabActionHelpers,
  createNavigatorFactory,
  EventMapBase,
  useNavigationBuilder,
} from "@react-navigation/native";
import * as React from "react";
import { View, TVFocusGuideView, FlatList } from "react-native";
import { withLayoutContext } from "expo-router";

import { RBTVIconName } from "../assets/icons/RBTVIcon";
import Button from "../components/Button";
import borderRadius from "../styles/tokens/borderRadius";
import color from "../styles/tokens/color";
import spacing from "../styles/tokens/spacing";
import perfectSize from "../styles/perfectSize";

type TVTopTabNavigationOptions = {
  icon?: RBTVIconName;
  title?: string;
};

type TVTopTabNavigatorProps = DefaultNavigatorOptions<
  ParamListBase,
  TabNavigationState<ParamListBase>,
  TVTopTabNavigationOptions,
  EventMapBase
> &
  TabRouterOptions;

function TVTopTabNavigator({
  initialRouteName,
  children,
  screenOptions,
}: TVTopTabNavigatorProps) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      TVTopTabNavigationOptions,
      Record<string, unknown>
    >(TabRouter, {
      children,
      screenOptions,
      initialRouteName,
    });

  return (
    <NavigationContent>
      {/* Use static FlatList instead of ScrollView, since FlatLists can't be nested in ScrollViews but in other FlatLists. */}
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
        }}
        data={["navigation", "screen"]}
        renderItem={({ item }) =>
          item === "navigation" ? (
            <TVFocusGuideView
              autoFocus
              trapFocusLeft
              trapFocusRight
              style={{ alignItems: "center", paddingVertical: spacing.xl }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: perfectSize(354),
                  height: perfectSize(90),
                  borderRadius: borderRadius.full,
                  borderColor: color.grey800,
                  borderWidth: perfectSize(4),
                }}
              >
                {state.routes.map((route, i) => (
                  <Button
                    style={{
                      marginLeft:
                        -perfectSize(4) - (i === 0 ? 0 : perfectSize(8)),
                      marginTop: -perfectSize(4),
                      marginBottom: -perfectSize(4),
                    }}
                    key={route.key}
                    icon={descriptors[route.key].options.icon}
                    title={descriptors[route.key].options.title}
                    onFocus={() => {
                      navigation.dispatch({
                        ...TabActions.jumpTo(route.name),
                        target: state.key,
                      });
                    }}
                  />
                ))}
              </View>
            </TVFocusGuideView>
          ) : (
            <>
              {state.routes.map((route, i) => {
                return (
                  <View
                    key={route.key}
                    style={{ display: i === state.index ? "flex" : "none" }}
                  >
                    {descriptors[route.key].render()}
                  </View>
                );
              })}
            </>
          )
        }
      />
    </NavigationContent>
  );
}

const createTVTopTabNavigator = createNavigatorFactory<
  TabNavigationState<ParamListBase>,
  TVTopTabNavigationOptions,
  EventMapBase,
  typeof TVTopTabNavigator
>(TVTopTabNavigator);

const TVTopTab = withLayoutContext(createTVTopTabNavigator().Navigator);

export default TVTopTab;
