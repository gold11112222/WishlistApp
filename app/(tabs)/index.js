import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Link, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// Тестові дані
const dummyLists = [
  { id: '1', name: 'Birthday Wishlist', itemCount: 5 },
  { id: '2', name: 'Christmas Ideas', itemCount: 8 },
  { id: '3', name: 'Tech Gadgets', itemCount: 12 },
];

export default function WishlistsScreen() {
  const handleSearch = () => {
    router.push('/(modals)/search');
  };
  
  const handleAddWishlist = () => {
    router.push('/(modals)/wishlist/create');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wishlists</Text>
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={handleSearch}
        >
          <FontAwesome name="search" size={20} color="#4a90e2" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={dummyLists}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Link href={`/(others)/wishlist/${item.id}`} asChild>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCount}>{item.itemCount} items</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddWishlist}
      >
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
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
