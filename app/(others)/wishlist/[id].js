import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// Тестові дані для вішлістів
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
  
  const handleAddItem = () => {
    router.push({
      pathname: '/(modals)/wishlist/add-item',
      params: { wishlistId: id }
    });
  };
  
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={[
          styles.itemPriority, 
          { color: item.priority === 'High' ? '#e74c3c' : item.priority === 'Medium' ? '#f39c12' : '#27ae60' }
        ]}>
          {item.priority}
        </Text>
      </View>
      <Text style={styles.itemPrice}>${item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="#4a90e2" />
        </TouchableOpacity>
        <Text style={styles.title}>{wishlist.name}</Text>
        <TouchableOpacity style={styles.editButton}>
          <FontAwesome name="pencil" size={20} color="#4a90e2" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={wishlist.items}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>This wishlist is empty</Text>
        }
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddItem}
      >
        <Text style={styles.addButtonText}>+ Add New Item</Text>
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
    alignItems: 'center',
    marginBottom: 16,
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
    flex: 1,
  },
  editButton: {
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  itemPriority: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  itemPrice: {
    fontSize: 16,
    color: '#666',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
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
