import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

// Тестові дані для друзів
const dummyFriends = [
  { id: '1', name: 'Anna Smith', username: 'anna_smith', avatar: null },
  { id: '2', name: 'Mike Johnson', username: 'mike_j', avatar: null },
  { id: '3', name: 'Sarah Williams', username: 'sarah_w', avatar: null },
];

// Тестові дані для запитів на дружбу
const dummyFriendRequests = [
  { id: '4', name: 'Robert Brown', username: 'rob_brown', avatar: null },
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('info');
  
  const renderFriendItem = ({ item }) => (
    <Link href={`/friends/${item.id}`} asChild>
      <TouchableOpacity style={styles.friendItem}>
        <View style={styles.avatarContainer}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
          )}
        </View>
        <Text style={styles.friendName}>{item.name}</Text>
      </TouchableOpacity>
    </Link>
  );
  
  const renderFriendRequestItem = ({ item }) => (
    <View style={styles.requestItem}>
      <View style={styles.requestUserInfo}>
        <View style={styles.avatarContainer}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
          )}
        </View>
        <View style={styles.userTextInfo}>
          <Text style={styles.friendName}>{item.name}</Text>
          <Text style={styles.usernameText}>@{item.username}</Text>
        </View>
      </View>
      <View style={styles.requestButtons}>
        <TouchableOpacity style={[styles.requestButton, styles.acceptButton]}>
          <FontAwesome name="check" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.requestButton, styles.rejectButton]}>
          <FontAwesome name="times" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileAvatarContainer}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>JD</Text>
          </View>
        </View>
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileUsername}>@john_doe</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Wishlists</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{dummyFriends.length}</Text>
            <Text style={styles.statLabel}>Friends</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'info' && styles.activeTab]} 
          onPress={() => setActiveTab('info')}
        >
          <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>Info</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]} 
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>Friends</Text>
        </TouchableOpacity>
        {dummyFriendRequests.length > 0 && (
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'requests' && styles.activeTab]} 
            onPress={() => setActiveTab('requests')}
          >
            <View style={styles.tabWithBadge}>
              <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>Requests</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{dummyFriendRequests.length}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
      
      {activeTab === 'info' && (
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <FontAwesome name="envelope" size={18} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoText}>john.doe@example.com</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name="calendar" size={18} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoText}>Member since January 2023</Text>
          </View>
        </View>
      )}
      
      {activeTab === 'friends' && (
        <View style={styles.friendsContainer}>
          <Link href="/search" asChild>
            <TouchableOpacity style={styles.addFriendButton}>
              <FontAwesome name="search" size={18} color="#fff" style={styles.addFriendIcon} />
              <Text style={styles.addFriendText}>Find Friends</Text>
            </TouchableOpacity>
          </Link>
          
          <FlatList
            data={dummyFriends}
            keyExtractor={item => item.id}
            renderItem={renderFriendItem}
            ListEmptyComponent={
              <Text style={styles.emptyMessage}>You have no friends yet</Text>
            }
          />
        </View>
      )}
      
      {activeTab === 'requests' && (
        <View style={styles.friendsContainer}>
          <Text style={styles.sectionTitle}>Friend Requests</Text>
          <FlatList
            data={dummyFriendRequests}
            keyExtractor={item => item.id}
            renderItem={renderFriendRequestItem}
            ListEmptyComponent={
              <Text style={styles.emptyMessage}>No pending friend requests</Text>
            }
          />
        </View>
      )}
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
  profileAvatarContainer: {
    marginBottom: 10,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  profileName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileUsername: {
    color: '#e6e6e6',
    fontSize: 16,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '80%',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#e6e6e6',
    fontSize: 14,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4a90e2',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTabText: {
    color: '#4a90e2',
    fontWeight: 'bold',
  },
  tabWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 20,
  },
  infoItem: {
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
  infoIcon: {
    marginRight: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  friendsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  addFriendButton: {
    backgroundColor: '#4a90e2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  addFriendIcon: {
    marginRight: 8,
  },
  addFriendText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendItem: {
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
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  requestUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userTextInfo: {
    marginLeft: 15,
  },
  usernameText: {
    fontSize: 14,
    color: '#777',
  },
  requestButtons: {
    flexDirection: 'row',
  },
  requestButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  acceptButton: {
    backgroundColor: '#27ae60',
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
});
