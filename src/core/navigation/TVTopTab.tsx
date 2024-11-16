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
  NavigatorTypeBagBase,
  NavigationProp,
  StaticConfig,
  TypedNavigator,
} from "@react-navigation/native";
import * as React from "react";
import { View, TVFocusGuideView, FlatList } from "react-native";
import { withLayoutContext } from "expo-router";

import { RBTVIconName } from "../assets/icons/RBTVIcon";
import Button from "../components/Button";

type TVTopTabNavigationConfig = void;

interface TVTopTabNavigationOptions {
  icon?: RBTVIconName;
  title?: string;
}

type TVTopTabNavigationEventMap = EventMapBase;

type TVTopTabNavigatorProps<
  NavigatorID extends string | undefined = undefined,
> = DefaultNavigatorOptions<
  ParamListBase,
  NavigatorID,
  TabNavigationState<ParamListBase>,
  TVTopTabNavigationOptions,
  TVTopTabNavigationEventMap,
  unknown
> &
  TabRouterOptions &
  TVTopTabNavigationConfig;

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
        contentContainerClassName="p-4"
        data={["navigation", "screen"]}
        renderItem={({ item }) =>
          item === "navigation" ? (
            <TVFocusGuideView
              autoFocus
              trapFocusLeft
              trapFocusRight
              className="self-center flex-row justify-center border-gray-800 border-4 rounded-full mb-4"
            >
              {state.routes.map((route, i) => (
                <Button
                  className={`m-[-4px] ${i === 0 ? "" : "ml-[-10px]"}`}
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
            </TVFocusGuideView>
          ) : (
            <>
              {state.routes.map((route, i) => {
                return (
                  <View
                    key={route.key}
                    className={i === state.index ? "flex-auto" : "hidden"}
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

const createTVTopTabNavigator = <
  const ParamList extends ParamListBase,
  const NavigatorID extends string | undefined = undefined,
  const TypeBag extends NavigatorTypeBagBase = {
    ParamList: ParamList;
    NavigatorID: NavigatorID;
    State: TabNavigationState<ParamList>;
    ScreenOptions: TVTopTabNavigationOptions;
    EventMap: EventMapBase;
    NavigationList: {
      [RouteName in keyof ParamList]: NavigationProp<
        ParamList,
        RouteName,
        NavigatorID
      >;
    };
    Navigator: typeof TVTopTabNavigator;
  },
  const Config extends StaticConfig<TypeBag> = StaticConfig<TypeBag>,
>(
  config?: Config
) =>
  createNavigatorFactory(TVTopTabNavigator)(config) as TypedNavigator<
    TypeBag,
    Config
  >;

const TVTopTab = withLayoutContext(createTVTopTabNavigator().Navigator);

export default TVTopTab;
