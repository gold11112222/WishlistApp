import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Тестові дані користувачів
const dummyUsers = [
  { id: '1', name: 'Anna Smith', username: 'anna_smith', avatar: null },
  { id: '2', name: 'John Doe', username: 'john_doe', avatar: null },
  { id: '3', name: 'Mike Johnson', username: 'mike_j', avatar: null },
  { id: '4', name: 'Sarah Williams', username: 'sarah_w', avatar: null },
  { id: '5', name: 'Robert Brown', username: 'rob_brown', avatar: null },
];

export default function SearchFriendsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    
    // Фільтруємо користувачів на основі пошукового запиту
    if (text.trim() === '') {
      setResults([]);
    } else {
      const filteredUsers = dummyUsers.filter(
        user => 
          user.name.toLowerCase().includes(text.toLowerCase()) || 
          user.username.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filteredUsers);
    }
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={styles.userItem}>
      <View style={styles.avatarContainer}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
        )}
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userUsername}>@{item.username}</Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <FontAwesome name="user-plus" size={20} color="#4a90e2" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Friends</Text>
      
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or username"
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
      </View>
      
      {searchQuery.trim() !== '' && (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={renderUserItem}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>No users found</Text>
          }
        />
      )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userUsername: {
    fontSize: 14,
    color: '#777',
  },
  addButton: {
    padding: 10,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
});
