import { Ionicons } from '@expo/vector-icons';
import { useSettings } from 'app/context/SettingsContext';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDatabase } from '../context/DatabaseContext';

export default function ProgressScreen() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const { settings } = useSettings();
  const { workouts } = useDatabase();
  const dark = settings.darkMode;

  // Calculate progress
  const completedWorkouts = workouts.filter(w => w.completed).length;
  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((sum, w) => sum + (typeof w.duration === 'number' ? w.duration : parseInt(w.duration)), 0);
  const weeklyGoal = 5;
  // Find current streak (number of consecutive days with at least one completed workout)
  const today = new Date();
  let streak = 0;
  let day = new Date(today);
  let workoutDates = workouts
    .filter(w => w.completed && w.completedAt)
    .map(w => new Date(w.completedAt.split('T')[0]));
  while (workoutDates.some(d => d.toDateString() === day.toDateString())) {
    streak++;
    day.setDate(day.getDate() - 1);
  }
  // Find longest streak
  let sortedDates = workoutDates.map(d => d.getTime()).sort((a, b) => a - b);
  let longestStreak = 0, currentStreak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    if (sortedDates[i] - sortedDates[i - 1] === 86400000) {
      currentStreak++;
    } else {
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, currentStreak);

  // Find most completed workout
  const workoutCounts = {};
  workouts.forEach(w => {
    if (w.completed) {
      workoutCounts[w.title] = (workoutCounts[w.title] || 0) + 1;
    }
  });
  const favoriteWorkout = Object.entries(workoutCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  // Recent activity (last 5 completed workouts)
  const recentActivities = workouts
    .filter(w => w.completed && w.completedAt)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, 5)
    .map((w, i) => ({
      id: i + 1,
      workout: w.title,
      date: w.completedAt ? w.completedAt.split('T')[0] : '',
      duration: typeof w.duration === 'number' ? w.duration : parseInt(w.duration),
      completed: true,
    }));

  const containerStyle = dark ? [styles.container, styles.darkContainer] : styles.container;
  const sectionStyle = dark ? [styles.section, styles.darkSection] : styles.section;
  const cardStyle = dark ? [styles.progressCard, styles.darkCard] : styles.progressCard;
  const statCardStyle = dark ? [styles.statCard, styles.darkStatCard] : styles.statCard;
  const favoriteCardStyle = dark ? [styles.favoriteCard, styles.darkFavoriteCard] : styles.favoriteCard;
  const textStyle = dark ? styles.darkText : styles.text;
  const tabStyle = dark ? [styles.tab, styles.darkTab] : styles.tab;
  const tabTextStyle = dark ? [styles.tabText, styles.darkTabText] : styles.tabText;
  const activeTabStyle = dark ? [styles.activeTab, styles.darkActiveTab] : styles.activeTab;
  const activeTabTextStyle = dark ? [styles.activeTabText, styles.darkActiveTabText] : styles.activeTabText;
  const statTitleStyle = dark ? [styles.statTitle, styles.darkStatTitle] : styles.statTitle;
  const statSubtitleStyle = dark ? [styles.statSubtitle, styles.darkStatSubtitle] : styles.statSubtitle;
  const statValueStyle = dark ? [styles.statValue, styles.darkStatValue] : styles.statValue;
  const favoriteTitleStyle = dark ? [styles.favoriteTitle, styles.darkFavoriteTitle] : styles.favoriteTitle;
  const favoriteWorkoutStyle = dark ? [styles.favoriteWorkout, styles.darkFavoriteWorkout] : styles.favoriteWorkout;
  const activityWorkoutStyle = dark ? [styles.activityWorkout, styles.darkActivityWorkout] : styles.activityWorkout;
  const activityDateStyle = dark ? [styles.activityDate, styles.darkActivityDate] : styles.activityDate;
  const activityDurationStyle = dark ? [styles.activityDuration, styles.darkActivityDuration] : styles.activityDuration;

  const renderStatCard = (title, value, subtitle, icon, color = '#007AFF') => (
    <View style={statCardStyle}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={statValueStyle}>{value}</Text>
      <Text style={statTitleStyle}>{title}</Text>
      {subtitle && <Text style={statSubtitleStyle}>{subtitle}</Text>}
    </View>
  );

  const renderActivityItem = (activity) => (
    <View key={activity.id} style={styles.activityItem}>
      <View style={styles.activityLeft}>
        <View style={[styles.activityDot, {
          backgroundColor: activity.completed ? '#34C759' : '#FF9500'
        }]} />
        <View style={styles.activityInfo}>
          <Text style={activityWorkoutStyle}>{activity.workout}</Text>
          <Text style={activityDateStyle}>{activity.date}</Text>
        </View>
      </View>
      <View style={styles.activityRight}>
        <Text style={activityDurationStyle}>{activity.duration} min</Text>
        <Ionicons
          name={activity.completed ? 'checkmark-circle' : 'time-outline'}
          size={16}
          color={activity.completed ? '#34C759' : '#FF9500'}
        />
      </View>
    </View>
  );

  return (
    <View style={containerStyle}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[tabStyle, selectedTab === 'overview' && activeTabStyle]}
          onPress={() => setSelectedTab('overview')}
        >
          <Text style={[tabTextStyle, selectedTab === 'overview' && activeTabTextStyle]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[tabStyle, selectedTab === 'activity' && activeTabStyle]}
          onPress={() => setSelectedTab('activity')}
        >
          <Text style={[tabTextStyle, selectedTab === 'activity' && activeTabTextStyle]}>
            Activity
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'overview' && (
          <>
            {/* Weekly Progress */}
            <View style={sectionStyle}>
              <Text style={textStyle}>This Week's Progress</Text>
              <View style={cardStyle}>
                <View style={styles.progressHeader}>
                  <Text style={dark ? styles.darkProgressText : styles.progressText}>
                    {completedWorkouts} of {weeklyGoal} workouts completed
                  </Text>
                  <Text style={dark ? styles.darkProgressPercentage : styles.progressPercentage}>
                    {Math.round((completedWorkouts / weeklyGoal) * 100)}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${(completedWorkouts / weeklyGoal) * 100}%`,
                        backgroundColor: dark ? "#90cdf4" : "#007AFF"
                      }
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* Stats Grid */}
            <View style={sectionStyle}>
              <Text style={textStyle}>Your Statistics</Text>
              <View style={styles.statsGrid}>
                {renderStatCard('Total Workouts', totalWorkouts, null, 'fitness', '#007AFF')}
                {renderStatCard('Current Streak', streak, 'days', 'flame', '#FF9500')}
                {renderStatCard('Total Minutes', totalMinutes, null, 'time', '#34C759')}
                {renderStatCard('Longest Streak', longestStreak, 'days', 'trophy', '#FF3B30')}
              </View>
            </View>

            {/* Favorite Workout */}
            <View style={sectionStyle}>
              <View style={favoriteCardStyle}>
                <Ionicons name="heart" size={24} color="#FF3B30" />
                <Text style={favoriteTitleStyle}>Most Completed Workout</Text>
                <Text style={favoriteWorkoutStyle}>{favoriteWorkout}</Text>
              </View>
            </View>
          </>
        )}

        {selectedTab === 'activity' && (
          <View style={sectionStyle}>
            <Text style={textStyle}>Recent Activity</Text>
            <View style={styles.activityList}>
              {recentActivities.length === 0 ? (
                <Text style={textStyle}>No recent activity yet.</Text>
              ) : (
                recentActivities.map(renderActivityItem)
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  darkContainer: { backgroundColor: '#121212' },
  section: { padding: 20 },
  darkSection: { backgroundColor: '#232323', borderRadius: 12 },
  text: { color: '#222', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  darkText: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: { backgroundColor: '#232323', shadowColor: '#222' },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressText: { color: '#333', fontSize: 16 },
  darkProgressText: { color: '#fff', fontSize: 16 },
  progressPercentage: { color: '#007AFF', fontWeight: 'bold', fontSize: 16 },
  darkProgressPercentage: { color: '#90cdf4', fontWeight: 'bold', fontSize: 16 },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: { height: '100%', borderRadius: 4 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flexBasis: '48%',
    backgroundColor: '#f0f4fa',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  darkStatCard: {
    backgroundColor: '#181a20',
    borderColor: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: { marginBottom: 8, borderRadius: 20, padding: 8 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#222' },
  darkStatValue: { color: '#fff' },
  statTitle: { fontSize: 14, color: '#666', marginTop: 2 },
  darkStatTitle: { color: '#bbb' },
  statSubtitle: { fontSize: 12, color: '#888' },
  darkStatSubtitle: { color: '#aaa' },
  favoriteCard: {
    backgroundColor: '#fff0f0',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  darkFavoriteCard: { backgroundColor: '#2a1a1a' },
  favoriteTitle: { fontSize: 16, color: '#FF3B30', marginTop: 8, fontWeight: 'bold' },
  darkFavoriteTitle: { color: '#ffb3b3' },
  favoriteWorkout: { fontSize: 18, color: '#222', marginTop: 4, fontWeight: 'bold' },
  darkFavoriteWorkout: { color: '#fff' },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  darkTab: { backgroundColor: '#181a20' },
  tabText: { color: '#222', fontWeight: 'bold', fontSize: 16 },
  darkTabText: { color: '#bbb' },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#007AFF',
    backgroundColor: '#e6f3ff',
  },
  darkActiveTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#90cdf4',
    backgroundColor: '#232f3e',
  },
  activeTabText: { color: '#007AFF' },
  darkActiveTabText: { color: '#90cdf4' },
  content: { flex: 1 },
  activityList: { marginTop: 10 },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  activityLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  activityDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  activityInfo: { flex: 1 },
  activityWorkout: { fontSize: 16, color: '#222', fontWeight: 'bold' },
  darkActivityWorkout: { color: '#fff' },
  activityDate: { fontSize: 12, color: '#888' },
  darkActivityDate: { color: '#bbb' },
  activityRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  activityDuration: { fontSize: 14, color: '#666', marginRight: 4 },
  darkActivityDuration: { color: '#bbb' },
});