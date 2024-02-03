import {
  useNavigationBuilder,
  TabRouter,
  TabActions,
  DefaultNavigatorOptions,
  ParamListBase,
  TabNavigationState,
  TabRouterOptions,
  TabActionHelpers,
  createNavigatorFactory,
  EventMapBase,
} from "@react-navigation/native";
import * as React from "react";
import { View, StyleSheet, TVFocusGuideView } from "react-native";

import { RBTVIconName } from "../assets/icons/RBTVIcon";
import Button from "../components/Button";
import borderRadius from "../styles/tokens/borderRadius";
import color from "../styles/tokens/color";
import spacing from "../styles/tokens/spacing";

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
      <TVFocusGuideView
        autoFocus
        trapFocusLeft
        trapFocusRight
        style={{ alignItems: "center" }}
      >
        <View
          style={{
            flexDirection: "row",
            marginTop: spacing.m,
            borderRadius: borderRadius.large,
            backgroundColor: color.bodyBg,
          }}
        >
          {state.routes.map((route, i) => (
            <Button
              key={route.key}
              icon={descriptors[route.key].options.icon}
              title={descriptors[route.key].options.title}
              buttonType={i === state.index ? "active" : undefined}
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
      <View style={{ flex: 1 }}>
        {state.routes.map((route, i) => {
          return (
            <View
              key={route.key}
              style={[
                StyleSheet.absoluteFill,
                { display: i === state.index ? "flex" : "none" },
              ]}
            >
              {descriptors[route.key].render()}
            </View>
          );
        })}
      </View>
    </NavigationContent>
  );
}

export default createNavigatorFactory<
  TabNavigationState<ParamListBase>,
  TVTopTabNavigationOptions,
  EventMapBase,
  typeof TVTopTabNavigator
>(TVTopTabNavigator);
