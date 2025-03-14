import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// Тестові дані для друзів
const dummyFriends = {
  '1': {
    id: '1',
    name: 'Anna Smith',
    username: 'anna_smith',
    avatar: null,
    wishlists: [
      { id: '1', name: 'Birthday Ideas', itemCount: 7 },
      { id: '2', name: 'Books to Read', itemCount: 12 },
    ]
  },
  '2': {
    id: '2',
    name: 'Mike Johnson',
    username: 'mike_j',
    avatar: null,
    wishlists: [
      { id: '1', name: 'Gadgets', itemCount: 5 },
      { id: '2', name: 'Outdoor Gear', itemCount: 3 },
    ]
  },
  '3': {
    id: '3',
    name: 'Sarah Williams',
    username: 'sarah_w',
    avatar: null,
    wishlists: [
      { id: '1', name: 'Kitchen Stuff', itemCount: 9 },
      { id: '2', name: 'Travel Wishlist', itemCount: 15 },
    ]
  },
};

export default function FriendDetailsScreen() {
  const { id } = useLocalSearchParams();
  const friend = dummyFriends[id] || { name: 'Unknown', wishlists: [] };
  
  const renderWishlistItem = ({ item }) => (
    <Link href={{
      pathname: "/friends/wishlist",
      params: { friendId: friend.id, wishlistId: item.id }
    }} asChild>
      <TouchableOpacity style={styles.wishlistItem}>
        <Text style={styles.wishlistName}>{item.name}</Text>
        <Text style={styles.wishlistCount}>{item.itemCount} items</Text>
        <FontAwesome name="chevron-right" size={16} color="#999" />
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{friend.name.charAt(0)}</Text>
          </View>
        </View>
        <Text style={styles.friendName}>{friend.name}</Text>
        <Text style={styles.friendUsername}>@{friend.username}</Text>
      </View>
      
      <View style={styles.wishlistsContainer}>
        <Text style={styles.sectionTitle}>{friend.name}'s Wishlists</Text>
        
        <FlatList
          data={friend.wishlists}
          keyExtractor={item => item.id}
          renderItem={renderWishlistItem}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>This friend has no wishlists</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#4a90e2',
    padding: 20,
    alignItems: 'center',
    paddingTop: 60,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  friendName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  friendUsername: {
    color: '#e6e6e6',
    fontSize: 16,
    marginTop: 4,
  },
  wishlistsContainer: {
    padding: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  wishlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  wishlistName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  wishlistCount: {
    color: '#666',
    marginRight: 10,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
});
