import { useSettings } from 'app/context/SettingsContext';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const { settings } = useSettings();

  const containerStyle = settings.darkMode ? 
    [styles.container, styles.darkContainer] : styles.container;
  const headerStyle = settings.darkMode ? 
    [styles.header, styles.darkHeader] : styles.header;
  const cardStyle = settings.darkMode ? 
    [styles.card, styles.darkCard] : styles.card;
  const textStyle = settings.darkMode ? 
    [styles.welcome, styles.darkText] : styles.welcome;
  const subtitleStyle = settings.darkMode ? 
    [styles.subtitle, styles.darkSubtext] : styles.subtitle;
  const cardTitleStyle = settings.darkMode ? 
    [styles.cardTitle, styles.darkText] : styles.cardTitle;
  const cardContentStyle = settings.darkMode ? 
    [styles.cardContent, styles.darkSubtext] : styles.cardContent;

  return (
    <ScrollView style={containerStyle}>
      <View style={headerStyle}>
        <Text style={textStyle}>Welcome back, {user?.name}!</Text>
        <Text style={subtitleStyle}>Ready for your injury prevention workout?</Text>
        
        {settings.workoutReminders && (
          <View style={[styles.notificationBadge, settings.darkMode && styles.darkNotificationBadge]}>
            <Text style={[styles.notificationText, settings.darkMode && styles.darkNotificationText]}>
              🔔 Reminders are on
            </Text>
          </View>
        )}
      </View>

      <View style={cardStyle}>
        <Text style={cardTitleStyle}>Today's Focus</Text>
        <Text style={cardContentStyle}>Lower Back Strengthening</Text>
      </View>

      <View style={cardStyle}>
        <Text style={cardTitleStyle}>Weekly Progress</Text>
        <Text style={cardContentStyle}>3 out of 5 workouts completed</Text>
        {settings.progressUpdates && (
          <Text style={[styles.progressNote, settings.darkMode && styles.darkProgressNote]}>
            📊 Progress tracking enabled
          </Text>
        )}
      </View>

      <View style={cardStyle}>
        <Text style={cardTitleStyle}>Next Workout</Text>
        <Text style={cardContentStyle}>Core Stability - 25 minutes</Text>
      </View>

      {settings.injuryAlerts && (
        <View style={cardStyle}>
          <Text style={cardTitleStyle}>🚨 Injury Prevention Tip</Text>
          <Text style={cardContentStyle}>
            Remember to warm up properly before each workout to prevent injuries!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    marginBottom: 20,
  },
  darkHeader: {
    backgroundColor: '#1e1e1e',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  darkText: {
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  darkSubtext: {
    color: '#aaa',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
    shadowColor: '#fff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardContent: {
    fontSize: 16,
    color: '#555',
  },
  notificationBadge: {
    marginTop: 10,
    backgroundColor: '#ffeb3b',
    padding: 8,
    borderRadius: 8,
  },
  darkNotificationBadge: {
    backgroundColor: '#ffee58',
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
  },
  darkNotificationText: {
    color: '#000',
  },
  progressNote: {
    marginTop: 8,
    fontSize: 14,
    color: '#888',
  },
  darkProgressNote: {
    color: '#ccc',
  },
});