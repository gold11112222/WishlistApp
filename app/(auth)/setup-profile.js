import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function SetupProfileScreen() {
  const { email } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  
  const { register, loading, error, getError } = useAuth();
  
  // Перевіряємо помилки
  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', getError());
    }
  }, [error]);
  
  const handleFinish = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    if (!username.trim()) {
      Alert.alert('Error', 'Please choose a username');
      return;
    }
    
    try {
      // Створення нового користувача
      const userData = {
        email,
        name,
        username,
        avatar: null, // В майбутньому можна додати завантаження аватара
      };
      
      await register(userData);
      
      // Перенаправлення до основного додатку
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Set Up Your Profile</Text>
        <Text style={styles.subtitle}>Let's create your profile</Text>
        
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <FontAwesome name="user" size={60} color="#ddd" />
            <View style={styles.addPhotoButton}>
              <FontAwesome name="camera" size={16} color="#fff" />
            </View>
          </View>
          <Text style={styles.addPhotoText}>Add Photo</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
          
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Choose a username"
            autoCapitalize="none"
          />
          
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={email}
            editable={false}
          />
          
          <TouchableOpacity 
            style={[styles.finishButton, loading && styles.disabledButton]}
            onPress={handleFinish}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.finishButtonText}>Finish Setup</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  addPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#f8f8f8',
  },
  addPhotoText: {
    fontSize: 16,
    color: '#4a90e2',
  },
  formContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 24,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  finishButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    height: 56,
  },
  disabledButton: {
    backgroundColor: '#a0c5e8',
  },
  finishButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
