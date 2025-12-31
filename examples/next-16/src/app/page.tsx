import { View, Text } from "react-native";
import { ThemePicker } from "@/app/ThemePicker";
import { PinWheel } from "@/app/Pinwheel";

export default function Home() {
  return (
    <View className="flex min-h-screen gap-8 items-center justify-center bg-background font-sans">
      <View className={"items-center gap-2"}>
        <PinWheel />
        <Text className={"text-foreground font-semibold text-3xl"}>
          Next.js with Uniwind Example
        </Text>
        <Text className={"text-foreground"}>
          All content on this page is styled with React Native components &
          tailwind classes
        </Text>
      </View>
      <ThemePicker />
      <View
        className={
          "p-6 border bg-card border-border rounded-2xl items-center justify-center gap-2"
        }
      >
        <Text className={"text-foreground font-semibold text-2xl"}>
          SSR support
        </Text>
        <Text className={"text-foreground"}>
          ✅ Server rendering is fully supported. Try disabling JavaScript and
          refreshing the page to try it out!
        </Text>
      </View>
    </View>
  );
}
