import { LazyColumn, type LazyColumnProps } from "@expo/ui/jetpack-compose";

function LazyScrollView(props: LazyColumnProps) {
  return <LazyColumn {...props} />;
}

export default LazyScrollView;
