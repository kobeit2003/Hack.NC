import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // Register a new user with email and password
  const register = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registration successful. Please log in.');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Registration failed. Please try again.');
    }
  };

  // Sign in an existing user with email and password
  const signInWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Sign-in failed. Please check your credentials.');
    }
  };

  const handleSignOut = () => signOut(auth);

  const value = { currentUser, register, signInWithEmail, signOut: handleSignOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;