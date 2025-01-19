// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../helpers/firebase.config';
import { TokenManager } from '../hooks/tokenManager';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth) {
        console.error('Auth is not initialized');
        setLoading(false);
        return;
      }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });


    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(); 
      console.log("lllllll+===========llllll",token);
      await TokenManager.setToken(token);
      return userCredential.user;
    } catch (error) {
      // Centralized error handling
      const errorMap = {
        'auth/invalid-credential': 'Invalid email or password',
        'auth/user-disabled': 'Account has been disabled',
        'User does not exist': 'Account not found. Please register.',
        'Email not verified': 'Please verify your email before logging in'
      };

      const errorMessage = errorMap[error.code] || error.message || 'Login failed';
      setError(errorMessage);
      return error;
    } finally {
      setLoading(false);
    }
  };

  const getToken = async () => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true); // Force refresh
      return token;
    }
    return null; // Return null if no user is authenticated
  };



  return { user, loading, error, signIn, getToken};
};