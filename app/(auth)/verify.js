import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function VerifyScreen() {
  const { email, isLogin } = useLocalSearchParams();
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const { verifyCode, login, sendVerificationCode, loading, error, getError } = useAuth();

  useEffect(() => {
    if (error) {
      Alert.alert('Error', getError());
    }
  }, [error]);

  useEffect(() => {
    // Запускаємо таймер для можливості повторної відправки
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCodeChange = (text, index) => {
    // Перевіряємо, щоб був лише числовий ввід
    if (text !== '' && !/^\d+$/.test(text)) {
      return;
    }
    
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    
    // Автоматичний перехід до наступного поля
    if (text.length === 1 && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 4) {
      Alert.alert('Error', 'Please enter the 4-digit code');
      return;
    }

    try {
      // Перевіряємо код
      const isValid = await verifyCode(email, fullCode);
      
      if (isValid) {
        if (isLogin === 'true') {
          // Користувач увійшов у систему
          await login(email);
          router.replace('/(tabs)');
        } else {
          // Користувач зареєструвався, перейдемо до налаштування профілю
          router.push({
            pathname: '/(auth)/setup-profile',
            params: { email }
          });
        }
      } else {
        Alert.alert('Error', 'Invalid verification code');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to verify code. Please try again.');
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    try {
      // Скидаємо таймер і відправляємо код знову
      setTimer(60);
      setCanResend(false);
      
      // Генеруємо новий код і зберігаємо його
      const newCode = await sendVerificationCode(email);
      
      // В реальному додатку тут був би запит на сервер для відправки коду на пошту
      Alert.alert('Code Resent', `New verification code: ${newCode}`); // Для тестування показуємо код
      
      // Запускаємо таймер знову
      const interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } catch (err) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
      setCanResend(true);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <FontAwesome name="arrow-left" size={20} color="#4a90e2" />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.title}>Verification Code</Text>
        <Text style={styles.subtitle}>
          Enter the 4-digit code sent to {email}
        </Text>
        
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={el => inputRefs.current[index] = el}
              style={styles.codeInput}
              value={digit}
              onChangeText={text => handleCodeChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
            />
          ))}
        </View>
        
        <TouchableOpacity 
          style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity 
            onPress={handleResendCode}
            disabled={!canResend || loading}
          >
            <Text style={[
              styles.resendButton,
              (!canResend || loading) && styles.resendButtonDisabled
            ]}>
              {canResend ? 'Resend' : `Resend (${timer}s)`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  codeInput: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  verifyButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
  verifyButtonDisabled: {
    backgroundColor: '#a0c5e8',
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  resendText: {
    color: '#666',
    fontSize: 16,
  },
  resendButton: {
    color: '#4a90e2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButtonDisabled: {
    color: '#999',
  },
});
