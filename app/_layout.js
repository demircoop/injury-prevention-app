import { Slot } from 'expo-router';
import { AuthProvider } from 'C:/Users/Cooper/Documents/injury-prevention-app/app/context/AuthContext.js';
import { DatabaseProvider } from 'C:/Users/Cooper/Documents/injury-prevention-app/app/context/DatabaseContext.js';
import { SettingsProvider } from 'C:/Users/Cooper/Documents/injury-prevention-app/app/context/SettingsContext.js';

export default function RootLayout() {
  return (
    <AuthProvider>
      <DatabaseProvider>
        <SettingsProvider>
          <Slot />
        </SettingsProvider>
      </DatabaseProvider>
    </AuthProvider>
  );
}