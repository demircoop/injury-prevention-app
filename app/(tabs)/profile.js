import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings } from 'app/context/SettingsContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Modal, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, signOut, updateProfile } = useAuth();
  const { settings, updateSettings } = useSettings();
  const router = useRouter();

  // Modal states
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [helpModal, setHelpModal] = useState(false);

  // Edit profile form
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

  // Redirect to welcome when signed out
  useEffect(() => {
    if (!user) {
      router.replace('/welcome');
    }
  }, [user, router]);

  // DIRECT SIGN OUT BUTTON (no Alert)
  const handleSignOut = async () => {
    console.log('Sign out button pressed');
    await signOut();
    console.log('Sign out finished');
  };
const handleResetAppData = async () => {
  Alert.alert(
    'Reset App Data',
    'This will erase all user data and create a new dummy account. Continue?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          try {
            // Remove all AsyncStorage keys related to users and workouts
            await AsyncStorage.clear();

            // Create a new dummy user
            const dummyUser = {
              id: Date.now().toString(),
              name: 'Demo User',
              email: `demo${Math.floor(Math.random() * 10000)}@example.com`,
              password: 'password',
              injuries: [],
              createdAt: new Date().toISOString(),
            };
            await AsyncStorage.setItem('users', JSON.stringify([dummyUser]));
            await AsyncStorage.setItem('currentUser', JSON.stringify({
              id: dummyUser.id,
              name: dummyUser.name,
              email: dummyUser.email,
              injuries: [],
            }));

            // Optionally, reset workouts here if you have default workouts

            Alert.alert('Success', 'App data reset. Restarting...');
            // Reload the app or navigate to welcome/login
            router.replace('/welcome');
          } catch (error) {
            Alert.alert('Error', 'Failed to reset app data.');
          }
        },
      },
    ]
  );
};
  const handleUpdateProfile = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const result = await updateProfile(editName, editEmail);
    if (result.success) {
      setEditProfileModal(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  // RESET WORKOUTS BUTTON HANDLER
  const handleResetWorkouts = async () => {
    Alert.alert(
      'Reset Workouts',
      'Are you sure you want to reset all workouts? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('workouts');
              if (user?.id) {
                await AsyncStorage.removeItem(`workouts_${user.id}`);
              }
              Alert.alert('Success', 'Workouts have been reset!');
            } catch (error) {
              console.error('Reset workouts error:', error);
              Alert.alert('Error', 'Failed to reset workouts. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderEditProfileModal = () => (
    <Modal visible={editProfileModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Profile</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={editName}
            onChangeText={setEditName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={editEmail}
            onChangeText={setEditEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setEditProfileModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderNotificationModal = () => (
    <Modal visible={notificationModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Notification Settings</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Workout Reminders</Text>
            <Switch
              value={settings.workoutReminders}
              onValueChange={(value) => updateSettings({ workoutReminders: value })}
              trackColor={{ false: '#767577', true: '#007AFF' }}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Progress Updates</Text>
            <Switch
              value={settings.progressUpdates}
              onValueChange={(value) => updateSettings({ progressUpdates: value })}
              trackColor={{ false: '#767577', true: '#007AFF' }}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Injury Alerts</Text>
            <Switch
              value={settings.injuryAlerts}
              onValueChange={(value) => updateSettings({ injuryAlerts: value })}
              trackColor={{ false: '#767577', true: '#007AFF' }}
            />
          </View>

          <TouchableOpacity
            style={[styles.modalButton, styles.doneButton]}
            onPress={() => setNotificationModal(false)}
          >
            <Text style={styles.saveButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderPrivacyModal = () => (
    <Modal visible={privacyModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Privacy Settings</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={settings.darkMode}
              onValueChange={(value) => updateSettings({ darkMode: value })}
              trackColor={{ false: '#767577', true: '#007AFF' }}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Share Progress</Text>
            <Switch
              value={settings.shareProgress}
              onValueChange={(value) => updateSettings({ shareProgress: value })}
              trackColor={{ false: '#767577', true: '#007AFF' }}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Data Analytics</Text>
            <Switch
              value={settings.dataAnalytics}
              onValueChange={(value) => updateSettings({ dataAnalytics: value })}
              trackColor={{ false: '#767577', true: '#007AFF' }}
            />
          </View>

          <TouchableOpacity
            style={[styles.modalButton, styles.doneButton]}
            onPress={() => setPrivacyModal(false)}
          >
            <Text style={styles.saveButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderHelpModal = () => (
    <Modal visible={helpModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Help & Support</Text>

          <TouchableOpacity style={styles.helpItem}>
            <Text style={styles.helpItemText}>📋 User Guide</Text>
            <Text style={styles.helpItemSubtext}>Learn how to use the app</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpItem}>
            <Text style={styles.helpItemText}>❓ FAQ</Text>
            <Text style={styles.helpItemSubtext}>Frequently asked questions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpItem}>
            <Text style={styles.helpItemText}>📧 Contact Support</Text>
            <Text style={styles.helpItemSubtext}>Get help from our team</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpItem}>
            <Text style={styles.helpItemText}>🐛 Report Bug</Text>
            <Text style={styles.helpItemSubtext}>Found an issue? Let us know</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, styles.doneButton]}
            onPress={() => setHelpModal(false)}
          >
            <Text style={styles.saveButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Don't render if no user (prevents flash)
  if (!user) {
    return null;
  }

  const containerStyle = settings.darkMode ?
    [styles.container, styles.darkContainer] : styles.container;
  const cardStyle = settings.darkMode ?
    [styles.profileCard, styles.darkCard] : styles.profileCard;
  const menuSectionStyle = settings.darkMode ?
    [styles.menuSection, styles.darkCard] : styles.menuSection;
  const textStyle = settings.darkMode ?
    [styles.name, styles.darkText] : styles.name;

  return (
    <View style={containerStyle}>
      <View style={cardStyle}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={textStyle}>{user?.name}</Text>
        <Text style={[styles.email, settings.darkMode && styles.darkSubtext]}>
          {user?.email}
        </Text>
      </View>

      <View style={menuSectionStyle}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setEditProfileModal(true)}
        >
          <Text style={[styles.menuText, settings.darkMode && styles.darkText]}>
            ✏️ Edit Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setNotificationModal(true)}
        >
          <Text style={[styles.menuText, settings.darkMode && styles.darkText]}>
            🔔 Notifications
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setPrivacyModal(true)}
        >
          <Text style={[styles.menuText, settings.darkMode && styles.darkText]}>
            🔒 Privacy Settings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setHelpModal(true)}
        >
          <Text style={[styles.menuText, settings.darkMode && styles.darkText]}>
            ❓ Help & Support
          </Text>
        </TouchableOpacity>
      </View>

      {/* DIRECT SIGN OUT BUTTON */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ marginHorizontal: 20, marginBottom: 30 }}>
  <Button
    title="Reset Workouts"
    onPress={handleResetWorkouts}
    color="#FF3B30"
  />
  <View style={{ height: 10 }} />
  <Button
    title="Reset App Data (New Dummy Account)"
    color="#007AFF"
    onPress={handleResetAppData}
  />
</View>
      {renderEditProfileModal()}
      {renderNotificationModal()}
      {renderPrivacyModal()}
      {renderHelpModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  profileCard: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 30,
    marginBottom: 20,
  },
  darkCard: {
    backgroundColor: '#2a2a2a',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  darkText: {
    color: 'white',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  darkSubtext: {
    color: '#aaa',
  },
  menuSection: {
    backgroundColor: 'white',
    marginBottom: 20,
  },
  menuItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  doneButton: {
    backgroundColor: '#007AFF',
    marginTop: 20,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Settings styles
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    flex: 1,
  },
  // Help styles
  helpItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  helpItemText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  helpItemSubtext: {
    fontSize: 14,
    color: '#666',
  },
});