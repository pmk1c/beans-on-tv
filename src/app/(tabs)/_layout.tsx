import TVTopTab from "../../core/navigation/TVTopTab";

export default function Layout() {
  return (
    <TVTopTab>
      <TVTopTab.Screen name="latest" options={{ title: "Neueste Videos" }} />
      <TVTopTab.Screen name="auth" options={{ icon: "user_circle" }} />
    </TVTopTab>
  );
}
