"use client";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Uniwind, useUniwind } from "uniwind";

export function ThemePicker() {
  const { theme, hasAdaptiveThemes } = useUniwind();

  const themes = [
    { name: "system", label: "System", icon: "🖥️" },
    { name: "light", label: "Light", icon: "☀️" },
    { name: "dark", label: "Dark", icon: "🌙" },
    { name: "ocean", label: "Ocean", icon: "🌊" },
    { name: "sunset", label: "Sunset", icon: "🌅" },
  ] as const;

  const activeTheme = hasAdaptiveThemes ? "system" : theme;

  return (
    <View className={"items-center"}>
      <Text className={"text-foreground text-xl mb-2 font-bold"}>
        Choose Theme
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {themes.map((t) => (
            <Pressable
              key={t.name}
              onPress={() => Uniwind.setTheme(t.name)}
              className={`
                px-4 py-3 rounded-lg items-center
                ${activeTheme === t.name ? "bg-primary" : "bg-card border border-border"}
              `}
            >
              <Text
                className={`text-2xl ${activeTheme === t.name ? "text-white" : "text-foreground"}`}
              >
                {t.icon}
              </Text>
              <Text
                className={`text-xs mt-1 ${activeTheme === t.name ? "text-white" : "text-foreground"}`}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
