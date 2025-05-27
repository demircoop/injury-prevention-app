import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const DatabaseContext = createContext();

const SAMPLE_WORKOUTS = [
  {
    id: '1',
    title: 'Lower Back Strengthening',
    duration: 25,
    difficulty: 'Beginner',
    description: 'Gentle exercises to strengthen your lower back and improve posture',
    exercises: [
      { name: 'Cat-Cow Stretch', duration: 2, instructions: 'Move between arching and rounding your back for 2 minutes.' },
      { name: 'Bird Dog', duration: 3, instructions: 'Extend opposite arm and leg, hold for a few seconds, alternate sides.' },
      { name: 'Glute Bridge', duration: 3, instructions: 'Lift hips up, squeeze glutes, hold for a second, lower down.' },
      { name: 'Dead Bug', duration: 3, instructions: 'Lower opposite arm and leg, keep core tight, alternate sides.' },
      { name: 'Modified Plank', duration: 2, instructions: 'Hold a plank position on your knees and elbows.' }
    ],
    category: 'Back',
    completed: false
  },
  {
    id: '2',
    title: 'Core Stability',
    duration: 30,
    difficulty: 'Intermediate',
    description: 'Focus on core stability to prevent injuries and improve balance',
    exercises: [
      { name: 'Plank', duration: 3, instructions: 'Hold a plank position on your forearms and toes.' },
      { name: 'Side Plank', duration: 2, instructions: 'Hold a side plank position on each side.' },
      { name: 'Russian Twists', duration: 3, instructions: 'Sit with feet off the ground, twist torso side to side.' },
      { name: 'Bird Dog', duration: 3, instructions: 'Extend opposite arm and leg, hold for a few seconds, alternate sides.' },
      { name: 'Glute Bridge', duration: 3, instructions: 'Lift hips up, squeeze glutes, hold for a second, lower down.' }
    ],
    category: 'Core', 
    completed: false,
  },
  // ...add more workouts soon
];

export function DatabaseProvider({ children }) {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load workouts for the current user
  useEffect(() => {
    if (!user) {
      setWorkouts([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const load = async () => {
      const key = `workouts_${user.id}`;
      const stored = await AsyncStorage.getItem(key);
      if (stored) setWorkouts(JSON.parse(stored));
      else {
        setWorkouts(SAMPLE_WORKOUTS);
        await AsyncStorage.setItem(key, JSON.stringify(SAMPLE_WORKOUTS));
      }
      setIsLoading(false);
    };
    load();
  }, [user]);

  // Save workouts for the current user
  const saveWorkouts = async (newWorkouts) => {
    if (!user) return;
    setWorkouts(newWorkouts);
    await AsyncStorage.setItem(`workouts_${user.id}`, JSON.stringify(newWorkouts));
  };

  // Mark workout complete
  const completeWorkout = async (workoutId) => {
    const updated = workouts.map(w =>
      w.id === workoutId ? { ...w, completed: true, completedAt: new Date().toISOString() } : w
    );
    await saveWorkouts(updated);
  };

  // Reset all workouts for current user
  const resetWorkouts = async () => {
    if (!user) return;
    await AsyncStorage.removeItem(`workouts_${user.id}`);
    setWorkouts(SAMPLE_WORKOUTS);
  };

  return (
    <DatabaseContext.Provider value={{
      workouts,
      isLoading,
      completeWorkout,
      resetWorkouts,
      saveWorkouts,
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
};