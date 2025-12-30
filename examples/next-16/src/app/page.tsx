import {View, Text} from "react-native";

export default function Home() {
  return (
    <View className="flex min-h-screen gap-4 items-center justify-center bg-zinc-50 font-sans">
        <Text className={'text-zinc-800 font-semibold text-3xl'}>Next.js with Uniwind Example</Text>
        <Text className={'text-zinc-500'}>All content on this page is styled with React Native components & tailwind classes</Text>
        <View className={'p-6 border bg-zinc-100 border-zinc-300 rounded-2xl items-center justify-center gap-2'}>
            <Text className={'text-zinc-800 font-semibold text-2xl'}>Is SSR supported?</Text>
            <Text className={'text-zinc-500'}>✅ Server rendering is fully supported. Try disabling JavaScript and refreshing the page to try it out!</Text>
        </View>
    </View>
  );
}