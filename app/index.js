import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { isAuthenticated } from './services/authService';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  // Якщо користувач автентифікований, перенаправляємо на головний екран
  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  // Інакше перенаправляємо на екран входу/реєстрації
  return <Redirect href="/(auth)/welcome" />;
}
