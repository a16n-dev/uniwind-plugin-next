'use client';
import {View, Text} from "react-native";
import {ThemePicker} from "@/app/ThemePicker";
import { Uniwind } from "uniwind";

export default function Home() {
  return (
    <View className="flex min-h-screen gap-4 items-center justify-center bg-background font-sans">
        <Text className={'text-foreground font-semibold text-3xl'}>Next.js with Uniwind Example</Text>
        <Text className={'text-foreground'}>All content on this page is styled with React Native components & tailwind classes</Text>
        <ThemePicker/>
        <View className={'p-6 border bg-card border-border rounded-2xl items-center justify-center gap-2'}>
            <Text className={'text-foreground font-semibold text-2xl'}>SSR support</Text>
            <Text className={'text-foreground'}>✅ Server rendering is fully supported. Try disabling JavaScript and refreshing the page to try it out!</Text>
        </View>

    </View>
  );
}