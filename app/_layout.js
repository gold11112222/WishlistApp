import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from './context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(modals)" />
        <Stack.Screen name="(others)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </AuthProvider>
  );
}
