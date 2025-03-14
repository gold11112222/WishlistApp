import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

// Тестові дані користувачів
const dummyUsers = [
  { id: '1', name: 'Anna Smith', username: 'anna_smith', avatar: null },
  { id: '2', name: 'John Doe', username: 'john_doe', avatar: null },
  { id: '3', name: 'Mike Johnson', username: 'mike_j', avatar: null },
  { id: '4', name: 'Sarah Williams', username: 'sarah_w', avatar: null },
  { id: '5', name: 'Robert Brown', username: 'rob_brown', avatar: null },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [sentRequests, setSentRequests] = useState({}); // Відстежуємо надіслані запити

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

  const handleSendFriendRequest = (userId) => {
    // В реальному додатку тут було б API для надсилання запиту дружби
    setSentRequests(prev => ({ ...prev, [userId]: true }));
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => router.push(`/(modals)/friends/${item.id}`)}
    >
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
      {sentRequests[item.id] ? (
        <View style={[styles.addButton, styles.requestSent]}>
          <FontAwesome name="check" size={18} color="#27ae60" />
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => handleSendFriendRequest(item.id)}
        >
          <FontAwesome name="user-plus" size={18} color="#4a90e2" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
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
        <Text style={styles.title}>Find Friends</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or username"
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoFocus={true}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <FontAwesome name="times-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      
      {searchQuery.trim() !== '' ? (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={renderUserItem}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>No users found</Text>
          }
        />
      ) : (
        <View style={styles.startSearchContainer}>
          <FontAwesome name="users" size={60} color="#ddd" />
          <Text style={styles.startSearchText}>
            Search for users to add as friends
          </Text>
        </View>
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
  clearButton: {
    padding: 5,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a90e2',
  },
  requestSent: {
    borderColor: '#27ae60',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
  startSearchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  startSearchText: {
    marginTop: 20,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
