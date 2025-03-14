import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

// Тестові дані
const dummyWishlists = {
  '1': {
    name: 'Birthday Wishlist',
    items: [
      { id: '1', name: 'iPhone 14', price: 999, priority: 'High' },
      { id: '2', name: 'MacBook Pro', price: 1999, priority: 'Medium' },
      { id: '3', name: 'AirPods Pro', price: 249, priority: 'Low' },
    ]
  },
  '2': {
    name: 'Christmas Ideas',
    items: [
      { id: '1', name: 'Nintendo Switch', price: 299, priority: 'Medium' },
      { id: '2', name: 'Kindle Paperwhite', price: 139, priority: 'Low' },
    ]
  },
  '3': {
    name: 'Tech Gadgets',
    items: [
      { id: '1', name: 'Drone', price: 799, priority: 'Medium' },
      { id: '2', name: 'GoPro', price: 349, priority: 'Low' },
      { id: '3', name: 'Smart Watch', price: 399, priority: 'High' },
    ]
  }
};

export default function WishlistDetailScreen() {
  const { id } = useLocalSearchParams();
  const wishlist = dummyWishlists[id] || { name: 'Unknown Wishlist', items: [] };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{wishlist.name}</Text>
      
      <FlatList
        data={wishlist.items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
            <Text style={[
              styles.itemPriority, 
              { color: item.priority === 'High' ? '#e74c3c' : item.priority === 'Medium' ? '#f39c12' : '#27ae60' }
            ]}>
              {item.priority}
            </Text>
          </View>
        )}
      />
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
  itemPrice: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  itemPriority: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
});
