import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const PRIORITIES = ['Low', 'Medium', 'High'];

export default function AddItemScreen() {
  const { wishlistId } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleAddItem = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for the item');
      return;
    }

    if (price && isNaN(parseFloat(price))) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    // В реальному додатку тут було б збереження через API або в локальне сховище
    Alert.alert('Success', 'Item added successfully', [
      { 
        text: 'OK', 
        onPress: () => router.back()
      }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="#4a90e2" />
        </TouchableOpacity>
        <Text style={styles.title}>Add New Item</Text>
      </View>
      
      <View style={styles.form}>
        <Text style={styles.label}>Item Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter item name"
        />
        
        <Text style={styles.label}>Price (optional)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          keyboardType="numeric"
        />
        
        <Text style={styles.label}>Link (optional)</Text>
        <TextInput
          style={styles.input}
          value={link}
          onChangeText={setLink}
          placeholder="Enter product link"
          keyboardType="url"
          autoCapitalize="none"
        />
        
        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityContainer}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity 
              key={p}
              style={[
                styles.priorityButton,
                priority === p && styles.priorityButtonActive,
                priority === p && { backgroundColor: p === 'High' ? '#e74c3c' : p === 'Medium' ? '#f39c12' : '#27ae60' }
              ]}
              onPress={() => setPriority(p)}
            >
              <Text 
                style={[
                  styles.priorityButtonText,
                  priority === p && styles.priorityButtonTextActive
                ]}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Enter notes"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddItem}
        >
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    paddingBottom: 40,
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
  priorityContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    borderRadius: 4,
  },
  priorityButtonActive: {
    borderColor: 'transparent',
  },
  priorityButtonText: {
    color: '#666',
  },
  priorityButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
