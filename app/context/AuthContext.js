import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

const signUp = async (email, password, name) => {
  setIsLoading(true);
  try {
    let existingUsers = await AsyncStorage.getItem('users');
    let users = [];
    try {
      users = existingUsers ? JSON.parse(existingUsers) : [];
      if (!Array.isArray(users)) users = [];
    } catch (e) {
      users = [];
    }
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password,
      injuries: [],
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    await AsyncStorage.setItem('users', JSON.stringify(users));
    const userForState = { id: newUser.id, email: newUser.email, name: newUser.name, injuries: [] };
    setUser(userForState);
    await AsyncStorage.setItem('currentUser', JSON.stringify(userForState));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || 'Unknown error during sign up' };
  } finally {
    setIsLoading(false);
  }
};
  const updateUserInjuries = async (injuries) => {
    if (!user) return;
    const updatedUser = { ...user, injuries };
    setUser(updatedUser);
    await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
    // Also update in users list
    const existingUsers = await AsyncStorage.getItem('users');
    let users = existingUsers ? JSON.parse(existingUsers) : [];
    users = users.map(u => u.id === user.id ? { ...u, injuries } : u);
    await AsyncStorage.setItem('users', JSON.stringify(users));
  };

  const signIn = async (email, password) => {
  setIsLoading(true);
  try {
    let existingUsers = await AsyncStorage.getItem('users');
    let users = [];
    try {
      users = existingUsers ? JSON.parse(existingUsers) : [];
      if (!Array.isArray(users)) users = [];
    } catch (e) {
      users = [];
    }
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userForState = { id: foundUser.id, email: foundUser.email, name: foundUser.name, injuries: foundUser.injuries || [] };
      setUser(userForState);
      await AsyncStorage.setItem('currentUser', JSON.stringify(userForState));
      return { success: true };
    } else {
      return { success: false, error: 'Invalid email or password' };
    }
  } catch (error) {
    return { success: false, error: error.message || 'Unknown error during sign in' };
  } finally {
    setIsLoading(false);
  }
};

  const updateProfile = async (name, email) => {
    setIsLoading(true);
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      // Get all users
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      // Check if email is taken by another user
      const emailTaken = users.find(u => u.email === email && u.id !== user.id);
      if (emailTaken) {
        return { success: false, error: 'Email is already taken' };
      }
      
      // Find and update the user
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }
      
      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        name,
        email,
        updatedAt: new Date().toISOString(),
      };
      
      // Save updated users list
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      // Update current user state
      const updatedUser = {
        id: user.id,
        name,
        email,
      };
      
      setUser(updatedUser);
      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      setUser(null);
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  const deleteAccount = async () => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      // Get all users
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      // Remove current user from users list
      const updatedUsers = users.filter(u => u.id !== user.id);
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Sign out
      await signOut();
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      deleteAccount,
      updateUserInjuries,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};