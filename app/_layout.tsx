import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { seedDatabase } from '../scripts/seed';

export default function RootLayout() {
  useEffect(() => {
    seedDatabase();
  }, []);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

