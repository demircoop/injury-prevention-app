import { SettingsProvider } from 'app/context/SettingsContext';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';

function AuthGate({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isLoading) {
      // If not signed in, redirect to welcome/login unless already there
      if (!user && segments[0] !== undefined && segments[0] !== 'welcome' && segments[0] !== 'login' && segments[0] !== 'signup') {
        router.replace('/welcome');
      }
      // If signed in and on welcome/login/signup, redirect to home
      if (user && ['welcome', 'login', 'signup'].includes(segments[0])) {
        router.replace('/(tabs)');
      }
    }
  }, [user, isLoading, segments]);

  if (isLoading) return null; // or a loading spinner

  return children;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <DatabaseProvider>
        <SettingsProvider>
          <AuthGate>
            <Slot />
          </AuthGate>
        </SettingsProvider>
      </DatabaseProvider>
    </AuthProvider>
  );
}