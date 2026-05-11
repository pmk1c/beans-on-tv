import {
  TVFocusGuideView as RNTVFocusGuideView,
  View,
  TVEventControl as RNTVEventControl,
} from "react-native";

export function TVFocusGuideView(props: React.ComponentProps<typeof RNTVFocusGuideView>) {
  if (RNTVFocusGuideView) {
    return <RNTVFocusGuideView {...props} />;
  } else {
    return <View {...props} />;
  }
}

export const TVEventControl: typeof RNTVEventControl | undefined = RNTVEventControl;
