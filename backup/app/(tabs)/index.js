import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Link } from 'expo-router';

// Тестові дані
const dummyLists = [
  { id: '1', name: 'Birthday Wishlist', itemCount: 5 },
  { id: '2', name: 'Christmas Ideas', itemCount: 8 },
  { id: '3', name: 'Tech Gadgets', itemCount: 12 },
];

export default function WishlistsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wishlists</Text>
      
      <FlatList
        data={dummyLists}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Link href={`/wishlist/${item.id}`} asChild>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCount}>{item.itemCount} items</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
      
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add New Wishlist</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 60,
  },
  item: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemCount: {
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
