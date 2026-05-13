import { ScrollView, type ScrollViewProps } from "@expo/ui";
import type { LazyVStackProps } from "@expo/ui/swift-ui";

function LazyScrollView(props: ScrollViewProps) {
  return <ScrollView {...props} />;
}

export default LazyScrollView;
