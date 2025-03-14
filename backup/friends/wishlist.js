import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// Тестові дані для вішлістів друзів
const dummyFriendsWishlists = {
  '1': {
    '1': {
      name: 'Birthday Ideas',
      items: [
        { id: '1', name: 'Bluetooth Speaker', price: 79, priority: 'High' },
        { id: '2', name: 'Art Supplies', price: 45, priority: 'Medium' },
        { id: '3', name: 'Cookbook', price: 25, priority: 'Low' },
      ]
    },
    '2': {
      name: 'Books to Read',
      items: [
        { id: '1', name: 'The Alchemist', price: 15, priority: 'Medium' },
        { id: '2', name: 'Atomic Habits', price: 18, priority: 'High' },
      ]
    }
  },
  '2': {
    '1': {
      name: 'Gadgets',
      items: [
        { id: '1', name: 'Wireless Earbuds', price: 129, priority: 'High' },
        { id: '2', name: 'Smart Watch', price: 249, priority: 'Medium' },
      ]
    }
  },
  '3': {
    '1': {
      name: 'Kitchen Stuff',
      items: [
        { id: '1', name: 'Stand Mixer', price: 299, priority: 'High' },
        { id: '2', name: 'Chef Knife Set', price: 150, priority: 'Medium' },
      ]
    }
  }
};

// Дані про друзів
const dummyFriends = {
  '1': { name: 'Anna', username: 'anna_smith' },
  '2': { name: 'Mike', username: 'mike_j' },
  '3': { name: 'Sarah', username: 'sarah_w' },
};

export default function FriendWishlistScreen() {
  const { friendId, wishlistId } = useLocalSearchParams();
  
  const friend = dummyFriends[friendId] || { name: 'Unknown' };
  const wishlist = dummyFriendsWishlists[friendId]?.[wishlistId] || { name: 'Unknown List', items: [] };
  
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
      <View style={styles.itemPriceContainer}>
        <Text style={styles.itemPrice}>${item.price}</Text>
        <TouchableButtonGroup />
      </View>
    </View>
  );
  
  const TouchableButtonGroup = () => (
    <View style={styles.buttonGroup}>
      <View style={[styles.button, styles.giftButton]}>
        <FontAwesome name="gift" size={16} color="#fff" />
        <Text style={styles.buttonText}>Gift</Text>
      </View>
      <View style={[styles.button, styles.wishlistButton]}>
        <FontAwesome name="plus" size={16} color="#fff" />
        <Text style={styles.buttonText}>Add to My List</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{friend.name}'s {wishlist.name}</Text>
      
      <FlatList
        data={wishlist.items}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>This wishlist is empty</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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
  itemPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    color: '#666',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  giftButton: {
    backgroundColor: '#e74c3c',
  },
  wishlistButton: {
    backgroundColor: '#4a90e2',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
});
