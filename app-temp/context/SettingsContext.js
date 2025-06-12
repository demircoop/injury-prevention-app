import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext.js';

const SettingsContext = createContext();

const defaultSettings = {
  workoutReminders: true,
  progressUpdates: true,
  injuryAlerts: true,
  darkMode: false,
  shareProgress: false,
  dataAnalytics: true,
  units: 'metric',
  language: 'en',
  autoSync: true,
};

export function SettingsProvider({ children }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStoredSettings();
    } else {
      setSettings(defaultSettings);
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [user]);

  const loadStoredSettings = async () => {
    setIsLoading(true);
    try {
      const key = `appSettings_${user.id}`;
      const storedSettings = await AsyncStorage.getItem(key);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } else {
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.log('Error loading settings:', error);
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    if (!user) return;
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      const key = `appSettings_${user.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(updatedSettings));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const resetSettings = async () => {
    if (!user) return;
    try {
      setSettings(defaultSettings);
      const key = `appSettings_${user.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(defaultSettings));
    } catch (error) {
      console.log('Error resetting settings:', error);
    }
  };

  const getSetting = (key) => settings[key];

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      resetSettings,
      getSetting,
      isLoading,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};