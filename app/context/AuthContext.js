import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/authService';

// Створюємо контекст
const AuthContext = createContext();

// Провайдер контексту
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Завантаження користувача при ініціалізації
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Перевірка існування користувача
  const checkUserExists = async (email) => {
    try {
      return await authService.userExists(email);
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Реєстрація нового користувача
  const register = async (email) => {
    try {
      setLoading(true);
      const user = await authService.registerUser(email);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Вхід користувача
  const login = async (email, password) => {
    try {
      setLoading(true);
      const userData = await authService.loginUser(email, password);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Скидання пароля
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      return await authService.resetPassword(email);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Вихід користувача
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logoutUser();
      setUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Оновлення профілю користувача
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      await authService.updateUserProfile(userData);
      setUser(prev => ({ ...prev, ...userData }));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Отримання помилки
  const getError = () => {
    const currentError = error;
    setError(null);
    return currentError;
  };

  const value = {
    user,
    loading,
    error,
    checkUserExists,
    register,
    login,
    resetPassword,
    logout,
    updateProfile,
    getError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Хук для використання контексту
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
