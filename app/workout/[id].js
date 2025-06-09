import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDatabase } from '../context/DatabaseContext';
import { useSettings } from '../context/SettingsContext';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const { workouts, completeWorkout } = useDatabase();
  const { settings } = useSettings();
  const dark = settings.darkMode;
  const router = useRouter();

  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [finished, setFinished] = useState(false);

  const workout = workouts.find(w => String(w.id) === String(id));

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  if (!workout) {
    return (
      <View style={[styles.container, dark && styles.darkContainer]}>
        <Text style={dark ? styles.darkText : styles.text}>Workout not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={dark ? "#90cdf4" : "#007AFF"} />
          <Text style={dark ? styles.darkActionText : styles.actionText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleStart = () => setTimerRunning(true);
  const handlePause = () => setTimerRunning(false);
  const handleReset = () => setTimer(0);
  const handleNext = () => {
    if (currentExercise < workout.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setTimer(0);
    } else {
      setTimerRunning(false);
      setFinished(true);
    }
  };
  const handlePrev = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setTimer(0);
    }
  };
  const handleFinishWorkout = () => {
    completeWorkout(workout.id);
    setFinished(false);
    Alert.alert('Workout Complete!', 'Great job! You finished this workout.', [
      { text: 'Done', onPress: () => router.replace('/(tabs)/workouts') }
    ]);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView style={[styles.container, dark && styles.darkContainer]} contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={dark ? "#90cdf4" : "#007AFF"} />
        <Text style={dark ? styles.darkActionText : styles.actionText}>Back</Text>
      </TouchableOpacity>
      {/* Workout Overview */}
      <Text style={dark ? styles.darkTitle : styles.title}>{workout.title}</Text>
      <Text style={dark ? styles.darkCategory : styles.category}>{workout.category}</Text>
      <Text style={dark ? styles.darkDescription : styles.description}>{workout.description}</Text>
      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={18} color={dark ? "#bbb" : "#666"} />
        <Text style={dark ? styles.darkInfoText : styles.infoText}>{workout.duration} min</Text>
        <Ionicons name="fitness-outline" size={18} color={dark ? "#bbb" : "#666"} style={{ marginLeft: 16 }} />
        <Text style={dark ? styles.darkInfoText : styles.infoText}>{workout.difficulty}</Text>
      </View>
      {/* Current Exercise */}
      <View style={styles.section}>
        <Text style={dark ? styles.darkSectionTitle : styles.sectionTitle}>Current Exercise</Text>
        <View
          style={[
            styles.exerciseCard,
            dark && styles.darkExerciseCard,
            styles.activeExerciseCard
          ]}
        >
          <Text style={dark ? styles.darkExerciseTitle : styles.exerciseTitle}>
            {currentExercise + 1}. {workout.exercises[currentExercise].name}
          </Text>
          <Text style={{ fontWeight: 'bold', color: dark ? '#90cdf4' : '#007AFF', marginBottom: 4 }}>
            Instructions:
          </Text>
          <Text style={dark ? styles.darkExerciseDesc : styles.exerciseDesc}>
            {workout.exercises[currentExercise].instructions}
          </Text>
          <Text style={dark ? styles.darkExerciseDesc : styles.exerciseDesc}>
            Required Time: {workout.exercises[currentExercise].duration} min
          </Text>
          <Text style={{ marginTop: 8, fontStyle: 'italic', color: dark ? '#bbb' : '#666' }}>
            {workout.description}
          </Text>
        </View>
      </View>
      {/* All Exercises */}
      <View style={styles.section}>
        <Text style={dark ? styles.darkSectionTitle : styles.sectionTitle}>All Exercises</Text>
        {workout.exercises.map((ex, idx) => (
          <View key={idx} style={[styles.exerciseCard, dark && styles.darkExerciseCard]}>
            <Text style={dark ? styles.darkExerciseTitle : styles.exerciseTitle}>
              {idx + 1}. {ex.name}
            </Text>
            <Text style={dark ? styles.darkExerciseDesc : styles.exerciseDesc}>
              {ex.instructions}
            </Text>
            <Text style={dark ? styles.darkExerciseDesc : styles.exerciseDesc}>
              Required Time: {ex.duration} min
            </Text>
          </View>
        ))}
      </View>
      {/* Timer and Controls */}
      <View style={styles.timerSection}>
        <Text style={dark ? styles.darkSectionTitle : styles.sectionTitle}>Timer</Text>
        <Text style={dark ? styles.darkTimer : styles.timer}>{formatTime(timer)}</Text>
        <View style={styles.timerControls}>
          <TouchableOpacity onPress={handlePrev} disabled={currentExercise === 0}>
            <Ionicons name="arrow-back-circle" size={36} color={currentExercise === 0 ? "#ccc" : (dark ? "#90cdf4" : "#007AFF")} />
          </TouchableOpacity>
          {timerRunning ? (
            <TouchableOpacity onPress={handlePause}>
              <Ionicons name="pause-circle" size={48} color={dark ? "#90cdf4" : "#007AFF"} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleStart}>
              <Ionicons name="play-circle" size={48} color={dark ? "#90cdf4" : "#007AFF"} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleNext} disabled={finished}>
            <Ionicons name="arrow-forward-circle" size={36} color={finished ? "#ccc" : (dark ? "#90cdf4" : "#007AFF")} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
          <Text style={dark ? styles.darkActionText : styles.actionText}>Reset Timer</Text>
        </TouchableOpacity>
        {finished && (
          <TouchableOpacity
            onPress={handleFinishWorkout}
            style={styles.completeButton}
          >
            <Ionicons name="checkmark-circle" size={24} color="#34C759" />
            <Text style={styles.completeText}>Mark Workout Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  darkContainer: { backgroundColor: '#121212' },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  darkTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  category: {
    fontSize: 14, color: '#007AFF', backgroundColor: '#e6f3ff',
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10,
    alignSelf: 'flex-start', marginBottom: 10,
  },
  darkCategory: {
    fontSize: 14, color: '#90cdf4', backgroundColor: '#232f3e',
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10,
    alignSelf: 'flex-start', marginBottom: 10,
  },
  description: { fontSize: 16, color: '#444', marginBottom: 12 },
  darkDescription: { fontSize: 16, color: '#ccc', marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 8 },
  infoText: { fontSize: 14, color: '#666', marginLeft: 4 },
  darkInfoText: { fontSize: 14, color: '#bbb', marginLeft: 4 },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  darkSectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  exerciseCard: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 12, marginBottom: 10 },
  darkExerciseCard: { backgroundColor: '#232323' },
  activeExerciseCard: { borderWidth: 2, borderColor: '#007AFF' },
  exerciseTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 2 },
  darkExerciseTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  exerciseDesc: { fontSize: 14, color: '#666' },
  darkExerciseDesc: { fontSize: 14, color: '#bbb' },
  timerSection: { alignItems: 'center', marginTop: 10, marginBottom: 30 },
  timer: { fontSize: 40, fontWeight: 'bold', color: '#007AFF', marginVertical: 10 },
  darkTimer: { fontSize: 40, fontWeight: 'bold', color: '#90cdf4', marginVertical: 10 },
  timerControls: { flexDirection: 'row', alignItems: 'center', gap: 20, marginVertical: 10 },
  resetButton: { marginTop: 8, marginBottom: 8 },
  actionText: { color: '#007AFF', fontWeight: 'bold', fontSize: 16 },
  darkActionText: { color: '#90cdf4', fontWeight: 'bold', fontSize: 16 },
  completeButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#e6ffe6',
    borderRadius: 8, padding: 10, marginTop: 16, alignSelf: 'center',
  },
  completeText: { color: '#34C759', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  text: { color: '#222', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  darkText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});