import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function WelcomeScreen() {
  const [email, setEmail] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  
  const { checkUserExists, register, resetPassword, loading, error, getError } = useAuth();

  // Перевіряємо помилки
  useEffect(() => {
    if (error) {
      Alert.alert('Error', getError());
    }
  }, [error]);

  // Перевіряємо, чи існує користувач з таким email
  const checkUser = async (inputEmail) => {
    if (!inputEmail || !inputEmail.includes('@')) return;
    
    setIsCheckingUser(true);
    const exists = await checkUserExists(inputEmail);
    setIsExistingUser(exists);
    setIsCheckingUser(false);
  };

  // Перевіряємо, чи існує користувач, коли змінюється email
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkUser(email);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [email]);

  const handleContinue = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      if (isExistingUser) {
        // Для існуючого користувача - відправка посилання для скидання пароля
        await resetPassword(email);
        Alert.alert(
          'Password Reset Link Sent',
          `We've sent a password reset link to ${email}. Please check your email and follow the instructions to set or reset your password.`,
          [{ text: 'OK' }]
        );
      } else {
        // Для нового користувача - реєстрація та відправка листа підтвердження
        await register(email);
        Alert.alert(
          'Verification Email Sent',
          `We've sent a verification email to ${email}. Please check your email to verify your account, then you'll receive instructions to set your password.`,
          [{ text: 'OK' }]
        );
      }
    } catch (err) {
      let errorMessage = 'An error occurred. Please try again.';
      
      // Обробка специфічних помилок Firebase
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use the login option.';
        setIsExistingUser(true);
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up.';
        setIsExistingUser(false);
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <FontAwesome name="gift" size={60} color="#4a90e2" />
        </View>
        <Text style={styles.appName}>Wishlist</Text>
        <Text style={styles.tagline}>Your personal wishlist manager</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>
          {isExistingUser ? 'Welcome back!' : 'Create an account'}
        </Text>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {isCheckingUser && (
            <ActivityIndicator size="small" color="#4a90e2" style={styles.indicator} />
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.continueButton, loading && styles.disabledButton]}
          onPress={handleContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsExistingUser(!isExistingUser)}
        >
          <Text style={styles.switchButtonText}>
            {isExistingUser
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
  },
  indicator: {
    marginRight: 16,
  },
  continueButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
  disabledButton: {
    backgroundColor: '#a0c5e8',
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#4a90e2',
    fontSize: 16,
  },
});
