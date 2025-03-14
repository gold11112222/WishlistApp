import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const settingsSections = [
  {
    title: 'Account',
    items: [
      { id: '1', title: 'Edit Profile', icon: 'user' },
      { id: '2', title: 'Change Password', icon: 'lock' },
      { id: '3', title: 'Privacy', icon: 'shield' },
    ]
  },
  {
    title: 'Notifications',
    items: [
      { id: '4', title: 'Push Notifications', icon: 'bell' },
      { id: '5', title: 'Email Notifications', icon: 'envelope' },
    ]
  },
  {
    title: 'About',
    items: [
      { id: '6', title: 'Terms of Service', icon: 'file-text-o' },
      { id: '7', title: 'Privacy Policy', icon: 'shield' },
      { id: '8', title: 'Help & Support', icon: 'question-circle' },
    ]
  },
];

export default function SettingsScreen() {
  const renderSettingItem = ({ item }) => (
    <TouchableOpacity style={styles.settingItem}>
      <FontAwesome name={item.icon} size={20} color="#4a90e2" style={styles.settingIcon} />
      <Text style={styles.settingTitle}>{item.title}</Text>
      <FontAwesome name="chevron-right" size={16} color="#999" />
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionTitle}>{section.title}</Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Settings</Text>
      
      <FlatList
        data={settingsSections}
        keyExtractor={(item, index) => `section-${index}`}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            {item.items.map(settingItem => (
              <TouchableOpacity key={settingItem.id} style={styles.settingItem}>
                <FontAwesome name={settingItem.icon} size={20} color="#4a90e2" style={styles.settingIcon} />
                <Text style={styles.settingTitle}>{settingItem.title}</Text>
                <FontAwesome name="chevron-right" size={16} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
      
      <TouchableOpacity style={styles.logoutButton}>
        <FontAwesome name="sign-out" size={18} color="#e74c3c" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Logout</Text>
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
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 60,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  settingIcon: {
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
});
