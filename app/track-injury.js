import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function TrackInjury() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Injury</Text>
      <Text style={styles.subtitle}>
        Log a new injury or view your recovery progress.
      </Text>

      <Pressable style={styles.button} onPress={() => router.push('/log-injury')}>
        <Text style={styles.buttonText}>Log New Injury</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push('/injury-history')}>
        <Text style={styles.buttonText}>View Injury History</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 30 },
  button: { backgroundColor: '#007aff', padding: 15, borderRadius: 20, marginVertical: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
