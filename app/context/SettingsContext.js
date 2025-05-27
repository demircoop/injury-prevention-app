import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext();

const defaultSettings = {
  // Notification settings
  workoutReminders: true,
  progressUpdates: true,
  injuryAlerts: true,
  
  // Privacy settings
  darkMode: false,
  shareProgress: false,
  dataAnalytics: true,
  
  // App preferences
  units: 'metric', // metric or imperial
  language: 'en',
  autoSync: true,
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from storage when app starts
  useEffect(() => {
    loadStoredSettings();
  }, []);

  const loadStoredSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem('appSettings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem('appSettings', JSON.stringify(updatedSettings));
      
      // Handle specific setting changes
      if (newSettings.darkMode !== undefined) {
        // You could trigger app-wide theme changes here
        console.log('Dark mode toggled:', newSettings.darkMode);
      }
      
      if (newSettings.workoutReminders !== undefined) {
        // You could set up or cancel local notifications here
        console.log('Workout reminders toggled:', newSettings.workoutReminders);
      }
      
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const resetSettings = async () => {
    try {
      setSettings(defaultSettings);
      await AsyncStorage.setItem('appSettings', JSON.stringify(defaultSettings));
    } catch (error) {
      console.log('Error resetting settings:', error);
    }
  };

  const getSetting = (key) => {
    return settings[key];
  };

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