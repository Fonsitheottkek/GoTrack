// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useTheme } from '../contexts/ThemeContext';
import { useHabits } from '../contexts/HabitContext';
import Header from '../components/Common/Header';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { habits } = useHabits();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Focused on building better habits every day!',
    profilePicture: null
  });

  // Load profile data from storage on mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + 'profile.json';
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      
      if (fileInfo.exists) {
        const data = await FileSystem.readAsStringAsync(fileUri);
        setProfileData(JSON.parse(data));
      }
    } catch (error) {
      console.log('No profile data found, using default values');
    }
  };

  const saveProfileData = async (data) => {
    try {
      await FileSystem.writeAsStringAsync(
        FileSystem.documentDirectory + 'profile.json',
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('Error saving profile data:', error);
      Alert.alert('Error', 'Failed to save profile data');
    }
  };

  const requestPermissions = async () => {
    try {
      const [cameraStatus, libraryStatus] = await Promise.all([
        ImagePicker.requestCameraPermissionsAsync(),
        ImagePicker.requestMediaLibraryPermissionsAsync(),
      ]);

      if (!cameraStatus.granted || !libraryStatus.granted) {
        Alert.alert(
          'Permission required',
          'Sorry, we need camera and photo library permissions to make this work!'
        );
        return false;
      }
      return true;
    } catch (error) {
      Alert.alert('Error', 'Failed to request permissions');
      return false;
    }
  };

  const pickImage = async () => {
    try {
      setIsLoading(true);
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newProfileData = { 
          ...profileData, 
          profilePicture: result.assets[0].uri 
        };
        setProfileData(newProfileData);
        await saveProfileData(newProfileData);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      setIsLoading(true);
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaType.Images, // NEW API
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
});

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newProfileData = { 
          ...profileData, 
          profilePicture: result.assets[0].uri 
        };
        setProfileData(newProfileData);
        await saveProfileData(newProfileData);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await saveProfileData(profileData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    loadProfileData();
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const SettingItem = ({ icon, title, description, rightComponent }) => (
    <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={colors.primary} style={styles.settingIcon} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {description && (
            <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
              {description}
            </Text>
          )}
        </View>
      </View>
      {rightComponent}
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={isEditing ? pickImage : null} disabled={!isEditing}>
            <View style={styles.profileImageContainer}>
              {profileData.profilePicture ? (
                <Image
                  source={{ uri: profileData.profilePicture }}
                  style={styles.profileImage}
                  onError={(error) => console.log('Image loading error:', error)}
                />
              ) : (
                <View style={[styles.profileImagePlaceholder, { backgroundColor: colors.primary }]}>
                  <Ionicons name="person" size={40} color="white" />
                </View>
              )}
              {isEditing && (
                <View style={styles.cameraIcon}>
                  <Ionicons name="camera" size={16} color="white" />
                </View>
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            {isEditing ? (
              <>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                  value={profileData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                  placeholder="Full Name"
                  placeholderTextColor={colors.textSecondary}
                />
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                  value={profileData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  placeholder="Email"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                />
              </>
            ) : (
              <>
                <Text style={[styles.profileName, { color: colors.text }]}>
                  {profileData.name}
                </Text>
                <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                  {profileData.email}
                </Text>
              </>
            )}
          </View>

          <TouchableOpacity
            onPress={isEditing ? handleSave : () => setIsEditing(true)}
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            disabled={isLoading}
          >
            <Ionicons
              name={isEditing ? 'checkmark' : 'create-outline'}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {isEditing && (
          <View style={[styles.bioSection, { backgroundColor: colors.card }]}>
            <Text style={[styles.label, { color: colors.text }]}>Bio</Text>
            <TextInput
              style={[styles.bioInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
              value={profileData.bio}
              onChangeText={(text) => handleInputChange('bio', text)}
              placeholder="Tell us about yourself..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>
        )}

        {!isEditing && profileData.bio && (
          <View style={[styles.bioSection, { backgroundColor: colors.card }]}>
            <Text style={[styles.bioText, { color: colors.text }]}>{profileData.bio}</Text>
          </View>
        )}

        {/* Photo Options (only shown when editing) */}
        {isEditing && (
          <View style={[styles.photoOptions, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile Photo</Text>
            <View style={styles.photoButtons}>
              <TouchableOpacity
                style={[styles.photoButton, { backgroundColor: colors.primary }]}
                onPress={pickImage}
                disabled={isLoading}
              >
                <Ionicons name="image" size={20} color="white" />
                <Text style={styles.photoButtonText}>Choose from Library</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.photoButton, { backgroundColor: colors.primary }]}
                onPress={takePhoto}
                disabled={isLoading}
              >
                <Ionicons name="camera" size={20} color="white" />
                <Text style={styles.photoButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* App Settings */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>App Settings</Text>
        
        <SettingItem
          icon="moon"
          title="Dark Mode"
          description="Toggle dark theme"
          rightComponent={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              thumbColor={isDark ? colors.primary : '#f4f3f4'}
              trackColor={{ false: '#767577', true: colors.primary + '80' }}
            />
          }
        />

        <SettingItem
          icon="notifications"
          title="Notifications"
          description="Enable habit reminders"
          rightComponent={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor={notificationsEnabled ? colors.primary : '#f4f3f4'}
              trackColor={{ false: '#767577', true: colors.primary + '80' }}
            />
          }
        />

        {/* Personal Stats */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Progress</Text>

        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {habits.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total Habits
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#4caf50' }]}>
              {habits.filter(h => h.completed).length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Completed Today
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#ff9800' }]}>
              {habits.reduce((sum, habit) => sum + habit.streak, 0)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total Streak
            </Text>
          </View>
        </View>

        {/* Action Buttons when editing */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton, { backgroundColor: colors.border }]}
              onPress={handleCancel}
              disabled={isLoading}
            >
              <Text style={[styles.actionButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={styles.actionButtonText}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    gap: 16,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3498db',
    borderRadius: 12,
    padding: 6,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  bioInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
  },
  photoOptions: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  photoButtons: {
    gap: 12,
    marginTop: 12,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 8,
  },
  photoButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
});

export default ProfileScreen;