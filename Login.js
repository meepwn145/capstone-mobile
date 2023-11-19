import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './config/firebase';
import { getFirestore, doc, getDoc } from "firebase/firestore";

export function LoginScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoToDashboard = (user) => {
    navigation.navigate('Profiles', { user });
};

  const handleForgotPassword = () => {
    navigation.navigate('Forgot');
  };

  const handleLogin = async () => {
    try {
      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
      // Safety check to ensure user exists in the userCredential
      if (!userCredential || !userCredential.user) {
        console.error('User not found in userCredential');
        return;
      }
  
      const { user } = userCredential;
      console.log('Authentication successful for UID:', user.uid);
  
  
      const userDocRef = doc(db, "user", user.uid);
  
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
    
        navigation.navigate('Dashboard', { user: userData });
      } else {
        console.error(`No user data found in Firestore for user: ${user.uid}`);
      }
    } catch (error) {
      
      console.error('Error logging in:', error.message || error);
  
    }
  };  

  return (
    <ImageBackground source={require('./images/loginn.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Log In</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    fontFamily: 'Courier New',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Courier New',
    color: '#fff',
  },
  button: {
    backgroundColor: '#3b89ac',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Courier New',
  },
});



export default LoginScreen;