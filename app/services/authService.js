import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Ключі для локального сховища
const USER_DATA_KEY = 'wishlist_user_data';

// Генерування тимчасового пароля
const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
};

// Реєстрація нового користувача
export const registerUser = async (email) => {
  try {
    // Генеруємо тимчасовий пароль для реєстрації
    const tempPassword = generateRandomPassword();
    
    // Створюємо користувача у Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword);
    const user = userCredential.user;
    
    // Відправляємо електронний лист для підтвердження пошти
    await sendEmailVerification(user);
    
    // Одразу відправляємо лист для скидання пароля
    await sendPasswordResetEmail(auth, email);
    
    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Вхід користувача
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Отримуємо додаткові дані з Firestore
    const userDoc = await getDoc(doc(db, 'users', email));
    let userData = {};
    
    if (userDoc.exists()) {
      // Оновлюємо дані часу останнього входу
      await setDoc(doc(db, 'users', email), {
        lastLogin: serverTimestamp()
      }, { merge: true });
      
      userData = userDoc.data();
    } else {
      // Створюємо записи у Firestore для нового користувача
      userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || '',
        username: '',
        avatar: user.photoURL || null,
        wishlists: [],
        friends: [],
        friendRequests: [],
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      };
      
      await setDoc(doc(db, 'users', email), userData);
    }
    
    // Зберігаємо користувача в AsyncStorage
    const userToCache = {
      uid: user.uid,
      email: user.email,
      name: userData.name || user.displayName || '',
      username: userData.username || '',
      avatar: userData.avatar || user.photoURL || null,
    };
    
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userToCache));
    
    return userToCache;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Перевірка, чи існує користувач
export const userExists = async (email) => {
  try {
    const userRef = doc(db, 'users', email);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
};

// Скидання пароля
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Вихід користувача
export const logoutUser = async () => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem(USER_DATA_KEY);
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};

// Отримання поточного користувача
export const getCurrentUser = async () => {
  try {
    // Спочатку перевіряємо AsyncStorage для швидкого доступу
    const cachedUser = await AsyncStorage.getItem(USER_DATA_KEY);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }
    
    // Потім перевіряємо Firebase Auth
    const user = auth.currentUser;
    if (user) {
      // Отримуємо додаткові дані з Firestore
      const userDoc = await getDoc(doc(db, 'users', user.email));
      
      let userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || '',
        username: '',
        avatar: user.photoURL || null,
      };
      
      if (userDoc.exists()) {
        const firestoreData = userDoc.data();
        userData.name = firestoreData.name || userData.name;
        userData.username = firestoreData.username || '';
        userData.avatar = firestoreData.avatar || userData.avatar;
      }
      
      // Кешуємо користувача
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      
      return userData;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Перевірка автентифікації
export const isAuthenticated = async () => {
  try {
    return auth.currentUser !== null;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Оновлення профілю користувача
export const updateUserProfile = async (userData) => {
  try {
    const { name, username, avatar } = userData;
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No authenticated user');
    }
    
    // Оновлюємо профіль в Firebase Auth
    await updateProfile(user, {
      displayName: name,
      photoURL: avatar
    });
    
    // Оновлюємо дані в Firestore
    await setDoc(doc(db, 'users', user.email), {
      name,
      username,
      avatar,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    // Оновлюємо локальний кеш
    const cachedUser = await AsyncStorage.getItem(USER_DATA_KEY);
    if (cachedUser) {
      const parsedUser = JSON.parse(cachedUser);
      const updatedUser = {
        ...parsedUser,
        name,
        username,
        avatar
      };
      
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
