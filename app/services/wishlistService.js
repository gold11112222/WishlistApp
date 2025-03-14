import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  query, 
  where 
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/firebase';
import { getCurrentUser } from './authService';

// Ключі для локального сховища
const WISHLISTS_KEY = 'wishlist_lists';

// Локальне отримання вішлістів
const getLocalWishlists = async () => {
  try {
    const data = await AsyncStorage.getItem(WISHLISTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting local wishlists:', error);
    return [];
  }
};

// Локальне збереження вішлістів
const saveLocalWishlists = async (wishlists) => {
  try {
    await AsyncStorage.setItem(WISHLISTS_KEY, JSON.stringify(wishlists));
  } catch (error) {
    console.error('Error saving local wishlists:', error);
  }
};

// Отримання вішлістів користувача
export const getUserWishlists = async (forceSync = false) => {
  try {
    // Спочатку отримуємо з локального сховища для швидкого відображення
    const localWishlists = await getLocalWishlists();
    
    if (!forceSync && localWishlists.length > 0) {
      return localWishlists;
    }
    
    // Отримуємо дані поточного користувача
    const user = await getCurrentUser();
    if (!user) {
      return [];
    }
    
    // Отримуємо вішлісти з Firestore
    const wishlistsRef = collection(db, 'wishlists');
    const q = query(wishlistsRef, where('ownerEmail', '==', user.email));
    const querySnapshot = await getDocs(q);
    
    const wishlists = [];
    querySnapshot.forEach((doc) => {
      wishlists.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Зберігаємо отримані дані локально
    await saveLocalWishlists(wishlists);
    
    return wishlists;
  } catch (error) {
    console.error('Error getting wishlists:', error);
    // При помилці повертаємо локальні дані
    return await getLocalWishlists();
  }
};

// Отримання вішліста за ID
export const getWishlistById = async (wishlistId) => {
  try {
    // Спочатку шукаємо локально
    const localWishlists = await getLocalWishlists();
    const localWishlist = localWishlists.find(w => w.id === wishlistId);
    
    // Отримуємо дані з Firestore
    const wishlistRef = doc(db, 'wishlists', wishlistId);
    const wishlistSnap = await getDoc(wishlistRef);
    
    if (wishlistSnap.exists()) {
      const wishlistData = {
        id: wishlistSnap.id,
        ...wishlistSnap.data()
      };
      
      // Оновлюємо локальні дані
      if (localWishlist) {
        const updatedWishlists = localWishlists.map(w => 
          w.id === wishlistId ? wishlistData : w
        );
        await saveLocalWishlists(updatedWishlists);
      }
      
      return wishlistData;
    }
    
    // Якщо не знайдено у Firestore, повертаємо локальні дані
    return localWishlist || null;
  } catch (error) {
    console.error('Error getting wishlist by id:', error);
    // При помилці повертаємо локальні дані
    const localWishlists = await getLocalWishlists();
    return localWishlists.find(w => w.id === wishlistId) || null;
  }
};

// Створення нового вішліста
export const createWishlist = async (wishlistData) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Підготовка даних для збереження
    const newWishlist = {
      ...wishlistData,
      ownerEmail: user.email,
      ownerName: user.name,
      ownerUsername: user.username,
      items: [],
      isPrivate: wishlistData.isPrivate || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Додаємо до Firestore
    const wishlistRef = await addDoc(collection(db, 'wishlists'), newWishlist);
    
    // Отримуємо ID документа
    const wishlistId = wishlistRef.id;
    
    // Додаємо ID до об'єкта
    const wishlistWithId = {
      id: wishlistId,
      ...newWishlist,
      createdAt: new Date().toISOString(), // для локального збереження замінюємо serverTimestamp
      updatedAt: new Date().toISOString()
    };
    
    // Оновлюємо локальні дані
    const localWishlists = await getLocalWishlists();
    localWishlists.push(wishlistWithId);
    await saveLocalWishlists(localWishlists);
    
    return wishlistWithId;
  } catch (error) {
    console.error('Error creating wishlist:', error);
    throw error;
  }
};

// Додавання елемента до вішліста
export const addItemToWishlist = async (wishlistId, itemData) => {
  try {
    // Отримуємо вішліст
    const wishlist = await getWishlistById(wishlistId);
    if (!wishlist) {
      throw new Error('Wishlist not found');
    }
    
    // Створюємо новий елемент
    const newItem = {
      id: Date.now().toString(), // Унікальний ID для елемента
      ...itemData,
      addedAt: new Date().toISOString()
    };
    
    // Додаємо елемент до вішліста
    const updatedItems = [...(wishlist.items || []), newItem];
    
    // Оновлюємо у Firestore
    const wishlistRef = doc(db, 'wishlists', wishlistId);
    await updateDoc(wishlistRef, {
      items: updatedItems,
      updatedAt: serverTimestamp()
    });
    
    // Оновлюємо локальні дані
    const localWishlists = await getLocalWishlists();
    const updatedWishlists = localWishlists.map(w => {
      if (w.id === wishlistId) {
        return {
          ...w,
          items: updatedItems,
          updatedAt: new Date().toISOString()
        };
      }
      return w;
    });
    await saveLocalWishlists(updatedWishlists);
    
    return newItem;
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    throw error;
  }
};

// Видалення елемента з вішліста
export const removeItemFromWishlist = async (wishlistId, itemId) => {
  try {
    // Отримуємо вішліст
    const wishlist = await getWishlistById(wishlistId);
    if (!wishlist) {
      throw new Error('Wishlist not found');
    }
    
    // Фільтруємо елементи
    const updatedItems = (wishlist.items || []).filter(item => item.id !== itemId);
    
    // Оновлюємо у Firestore
    const wishlistRef = doc(db, 'wishlists', wishlistId);
    await updateDoc(wishlistRef, {
      items: updatedItems,
      updatedAt: serverTimestamp()
    });
    
    // Оновлюємо локальні дані
    const localWishlists = await getLocalWishlists();
    const updatedWishlists = localWishlists.map(w => {
      if (w.id === wishlistId) {
        return {
          ...w,
          items: updatedItems,
          updatedAt: new Date().toISOString()
        };
      }
      return w;
    });
    await saveLocalWishlists(updatedWishlists);
    
    return true;
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    throw error;
  }
};

// Видалення вішліста
export const deleteWishlist = async (wishlistId) => {
  try {
    // Видаляємо з Firestore
    await deleteDoc(doc(db, 'wishlists', wishlistId));
    
    // Оновлюємо локальні дані
    const localWishlists = await getLocalWishlists();
    const updatedWishlists = localWishlists.filter(w => w.id !== wishlistId);
    await saveLocalWishlists(updatedWishlists);
    
    return true;
  } catch (error) {
    console.error('Error deleting wishlist:', error);
    
    // Навіть якщо видалення з Firestore не вдалося,
    // видалимо з локального сховища
    const localWishlists = await getLocalWishlists();
    const updatedWishlists = localWishlists.filter(w => w.id !== wishlistId);
    await saveLocalWishlists(updatedWishlists);
    
    return false;
  }
};

// Отримання публічних вішлістів друга
export const getFriendWishlists = async (friendEmail) => {
  try {
    // Отримуємо вішлісти з Firestore
    const wishlistsRef = collection(db, 'wishlists');
    const q = query(
      wishlistsRef, 
      where('ownerEmail', '==', friendEmail),
      where('isPrivate', '==', false)
    );
    const querySnapshot = await getDocs(q);
    
    const wishlists = [];
    querySnapshot.forEach((doc) => {
      wishlists.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return wishlists;
  } catch (error) {
    console.error('Error getting friend wishlists:', error);
    return [];
  }
};
