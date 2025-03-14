import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  arrayUnion, 
  arrayRemove, 
  query, 
  where, 
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/firebase';
import { getCurrentUser } from './authService';

// Ключі для локального сховища
const FRIENDS_KEY = 'wishlist_friends';
const FRIEND_REQUESTS_KEY = 'wishlist_friend_requests';

// Отримання даних користувача за email
export const getUserByEmail = async (email) => {
  try {
    const userRef = doc(db, 'users', email);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return {
        email,
        ...userSnap.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

// Пошук користувачів
export const searchUsers = async (query) => {
  try {
    // У Firestore немає вбудованого пошуку тексту
    // Тут використовуємо простий метод для прототипу
    // В реальному додатку краще використовувати Algolia, Elastic Search або Cloud Functions
    
    // Отримуємо всіх користувачів
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    // Фільтруємо локально
    const users = [];
    const currentUser = await getCurrentUser();
    
    snapshot.forEach((doc) => {
      const userData = doc.data();
      
      // Пропускаємо поточного користувача
      if (userData.email === currentUser?.email) {
        return;
      }
      
      // Шукаємо збіги в імені, username або email
      const lowerQuery = query.toLowerCase();
      if (
        userData.name?.toLowerCase().includes(lowerQuery) ||
        userData.username?.toLowerCase().includes(lowerQuery) ||
        userData.email?.toLowerCase().includes(lowerQuery)
      ) {
        users.push({
          email: doc.id,
          name: userData.name,
          username: userData.username,
          avatar: userData.avatar
        });
      }
    });
    
    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};

// Отримання друзів поточного користувача
export const getFriends = async (forceSync = false) => {
  try {
    // Отримуємо поточного користувача
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return [];
    }
    
    // Спочатку перевіряємо локальне сховище
    if (!forceSync) {
      const localFriends = await AsyncStorage.getItem(FRIENDS_KEY);
      if (localFriends) {
        return JSON.parse(localFriends);
      }
    }
    
    // Отримуємо список друзів з Firestore
    const userRef = doc(db, 'users', currentUser.email);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return [];
    }
    
    const userData = userSnap.data();
    const friendEmails = userData.friends || [];
    
    // Отримуємо деталі про кожного друга
    const friends = [];
    for (const email of friendEmails) {
      const friendData = await getUserByEmail(email);
      if (friendData) {
        friends.push({
          email,
          name: friendData.name,
          username: friendData.username,
          avatar: friendData.avatar
        });
      }
    }
    
    // Зберігаємо в локальному сховищі
    await AsyncStorage.setItem(FRIENDS_KEY, JSON.stringify(friends));
    
    return friends;
  } catch (error) {
    console.error('Error getting friends:', error);
    
    // При помилці повертаємо локальні дані
    const localFriends = await AsyncStorage.getItem(FRIENDS_KEY);
    return localFriends ? JSON.parse(localFriends) : [];
  }
};

// Отримання запитів на дружбу
export const getFriendRequests = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return [];
    }
    
    // Отримуємо запити з Firestore
    const userRef = doc(db, 'users', currentUser.email);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return [];
    }
    
    const userData = userSnap.data();
    const requestEmails = userData.friendRequests || [];
    
    // Отримуємо деталі про кожен запит
    const requests = [];
    for (const email of requestEmails) {
      const userData = await getUserByEmail(email);
      if (userData) {
        requests.push({
          email,
          name: userData.name,
          username: userData.username,
          avatar: userData.avatar
        });
      }
    }
    
    // Зберігаємо в локальному сховищі
    await AsyncStorage.setItem(FRIEND_REQUESTS_KEY, JSON.stringify(requests));
    
    return requests;
  } catch (error) {
    console.error('Error getting friend requests:', error);
    
    // При помилці повертаємо локальні дані
    const localRequests = await AsyncStorage.getItem(FRIEND_REQUESTS_KEY);
    return localRequests ? JSON.parse(localRequests) : [];
  }
};

// Надсилання запиту на дружбу
export const sendFriendRequest = async (friendEmail) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Перевіряємо, чи існує користувач
    const friendData = await getUserByEmail(friendEmail);
    if (!friendData) {
      throw new Error('User not found');
    }
    
    // Додаємо запит до списку запитів користувача
    const friendRef = doc(db, 'users', friendEmail);
    await updateDoc(friendRef, {
      friendRequests: arrayUnion(currentUser.email)
    });
    
    return true;
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

// Прийняття запиту на дружбу
export const acceptFriendRequest = async (friendEmail) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Використовуємо транзакцію для атомарного оновлення обох документів
    await runTransaction(db, async (transaction) => {
      // Документи користувачів
      const currentUserRef = doc(db, 'users', currentUser.email);
      const friendRef = doc(db, 'users', friendEmail);
      
      // Отримуємо поточні дані
      const currentUserDoc = await transaction.get(currentUserRef);
      const friendDoc = await transaction.get(friendRef);
      
      if (!currentUserDoc.exists() || !friendDoc.exists()) {
        throw new Error('User not found');
      }
      
      // Додаємо користувачів до списків друзів один одного
      transaction.update(currentUserRef, {
        friends: arrayUnion(friendEmail),
        friendRequests: arrayRemove(friendEmail)
      });
      
      transaction.update(friendRef, {
        friends: arrayUnion(currentUser.email)
      });
    });
    
    // Оновлюємо локальні дані
    await getFriends(true);
    await getFriendRequests();
    
    return true;
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
};

// Відхилення запиту на дружбу
export const rejectFriendRequest = async (friendEmail) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Видаляємо запит зі списку
    const userRef = doc(db, 'users', currentUser.email);
    await updateDoc(userRef, {
      friendRequests: arrayRemove(friendEmail)
    });
    
    // Оновлюємо локальні дані
    await getFriendRequests();
    
    return true;
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    throw error;
  }
};

// Видалення друга
export const removeFriend = async (friendEmail) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Використовуємо транзакцію для атомарного оновлення обох документів
    await runTransaction(db, async (transaction) => {
      // Документи користувачів
      const currentUserRef = doc(db, 'users', currentUser.email);
      const friendRef = doc(db, 'users', friendEmail);
      
      // Отримуємо поточні дані
      const currentUserDoc = await transaction.get(currentUserRef);
      const friendDoc = await transaction.get(friendRef);
      
      if (!currentUserDoc.exists() || !friendDoc.exists()) {
        throw new Error('User not found');
      }
      
      // Видаляємо користувачів зі списків друзів один одного
      transaction.update(currentUserRef, {
        friends: arrayRemove(friendEmail)
      });
      
      transaction.update(friendRef, {
        friends: arrayRemove(currentUser.email)
      });
    });
    
    // Оновлюємо локальні дані
    await getFriends(true);
    
    return true;
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};
