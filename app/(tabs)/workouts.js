import { Ionicons } from '@expo/vector-icons';
import { useSettings } from 'app/context/SettingsContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDatabase } from '../context/DatabaseContext';

export default function WorkoutsScreen() {
  const { workouts, isLoading, resetWorkouts } = useDatabase();
  const { settings } = useSettings();
  const dark = settings.darkMode;
  const router = useRouter();

  const containerStyle = dark ? [styles.container, styles.darkContainer] : styles.container;
  const headerStyle = dark ? [styles.header, styles.darkHeader] : styles.header;
  const cardStyle = dark ? [styles.card, styles.darkCard] : styles.card;
  const completedCardStyle = dark ? [styles.completedCard, styles.darkCompletedCard] : styles.completedCard;
  const titleStyle = dark ? [styles.title, styles.darkTitle] : styles.title;
  const descriptionStyle = dark ? [styles.description, styles.darkDescription] : styles.description;
  const infoTextStyle = dark ? [styles.infoText, styles.darkInfoText] : styles.infoText;
  const actionTextStyle = dark ? [styles.actionText, styles.darkActionText] : styles.actionText;

  const handleWorkoutPress = (workout) => {
    router.push({ pathname: '/workout/[id]', params: { id: workout.id } });
  };

  const handleResetWorkouts = async () => {
    await resetWorkouts();
    alert('Workouts reset! Restart the app to see changes.');
  };

  const renderWorkoutCard = ({ item: workout }) => (
    <TouchableOpacity
      style={[
        cardStyle,
        workout.completed && completedCardStyle
      ]}
      onPress={() => handleWorkoutPress(workout)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={[titleStyle, workout.completed && styles.completedTitle]}>
            {workout.title}
          </Text>
          <Text style={styles.category}>{workout.category}</Text>
        </View>
        <View style={styles.statusContainer}>
          {workout.completed ? (
            <Ionicons name="checkmark-circle" size={24} color="#34C759" />
          ) : (
            <Ionicons name="play-circle-outline" size={24} color={dark ? "#90cdf4" : "#007AFF"} />
          )}
        </View>
      </View>

      <Text style={descriptionStyle}>{workout.description}</Text>

      <View style={styles.cardFooter}>
        <View style={styles.infoContainer}>
          <Ionicons name="time-outline" size={16} color={dark ? "#bbb" : "#666"} />
          <Text style={infoTextStyle}>{workout.duration} min</Text>
        </View>
        <View style={styles.infoContainer}>
          <Ionicons name="fitness-outline" size={16} color={dark ? "#bbb" : "#666"} />
          <Text style={infoTextStyle}>{workout.difficulty}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Ionicons name="list-outline" size={16} color={dark ? "#bbb" : "#666"} />
          <Text style={infoTextStyle}>{workout.exercises.length} exercises</Text>
        </View>
      </View>

      <View style={{ marginTop: 8 }}>
        <Text style={[infoTextStyle, { fontWeight: 'bold' }]}>Exercises:</Text>
        {workout.exercises.map((ex, idx) => (
          <Text key={idx} style={infoTextStyle}>
            {idx + 1}. {ex.name} ({ex.duration} min): {ex.instructions}
          </Text>
        ))}
      </View>

      <Text style={[
        actionTextStyle,
        workout.completed && styles.completedActionText
      ]}>
        {workout.completed ? 'Tap to view again' : 'Tap to start workout'}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={containerStyle}>
        <ActivityIndicator size="large" color={dark ? "#90cdf4" : "#007AFF"} />
        <Text style={dark ? styles.darkLoadingText : styles.loadingText}>Loading workouts...</Text>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <View style={headerStyle}>
        <Text style={styles.headerTitle}>Your Workouts</Text>
        <Text style={styles.headerSubtitle}>
          {workouts.filter(w => w.completed).length} of {workouts.length} completed
        </Text>
        <Button title="Reset Workouts" onPress={handleResetWorkouts} color="#FF3B30" />
      </View>

      <FlatList
        data={workouts}
        renderItem={renderWorkoutCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  darkContainer: { backgroundColor: '#121212' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  darkLoadingText: { marginTop: 10, fontSize: 16, color: '#bbb' },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  darkHeader: {
    backgroundColor: '#181a20',
    borderBottomColor: '#232323',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: { padding: 10 },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  darkCard: {
    backgroundColor: '#232323',
    borderColor: '#333',
    shadowColor: '#222',
  },
  completedCard: {
    backgroundColor: '#f8fff8',
    borderColor: '#34C759',
    borderWidth: 2,
  },
  darkCompletedCard: {
    backgroundColor: '#1a2b1a',
    borderColor: '#34C759',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleContainer: { flex: 1 },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  darkTitle: { color: '#fff' },
  completedTitle: { color: '#34C759' },
  category: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#e6f3ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  statusContainer: { marginLeft: 10 },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  darkDescription: { color: '#ccc' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  darkInfoText: { color: '#bbb' },
  actionText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
  darkActionText: { color: '#90cdf4' },
  completedActionText: { color: '#34C759' },
});