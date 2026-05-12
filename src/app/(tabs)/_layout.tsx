import RBTVIcon from "@/src/core/assets/icons/RBTVIcon";
import fontPresets from "@/src/core/styles/tokens/fontPresets";
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function Layout() {
  return (
    <NativeTabs labelStyle={fontPresets.l}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Neueste Videos</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="play.rectangle.fill" md="play_circle" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Einstellungen</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.VectorIcon family={RBTVIcon} name="user_circle" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
