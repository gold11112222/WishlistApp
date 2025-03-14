import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function CreateWishlistScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for your wishlist');
      return;
    }

    // В реальному додатку тут було б збереження через API або в локальне сховище
    Alert.alert('Success', 'Wishlist created successfully', [
      { 
        text: 'OK', 
        onPress: () => router.back()
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="#4a90e2" />
        </TouchableOpacity>
        <Text style={styles.title}>Create New Wishlist</Text>
      </View>
      
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter wishlist name"
        />
        
        <Text style={styles.label}>Description (optional)</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        
        <TouchableOpacity 
          style={styles.privacyOption}
          onPress={() => setIsPrivate(!isPrivate)}
        >
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, isPrivate && styles.checkboxActive]}>
              {isPrivate && <FontAwesome name="check" size={14} color="#fff" />}
            </View>
          </View>
          <Text style={styles.privacyText}>Make this wishlist private</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreate}
        >
          <Text style={styles.createButtonText}>Create Wishlist</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
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
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  textarea: {
    height: 100,
    paddingTop: 12,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#4a90e2',
  },
  privacyText: {
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
