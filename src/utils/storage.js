// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = '@habits';
// src/utils/storage.js - Update to new File System API
import * as FileSystem from 'expo-file-system';

// Replace deprecated methods with new API
export const loadHabits = async () => {
  try {
    const fileUri = FileSystem.documentDirectory + 'habits.json';
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    
    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(fileUri);
      return content ? JSON.parse(content) : [];
    }
    return [];
  } catch (error) {
    console.error('Error loading habits:', error);
    return [];
  }
};

export const saveHabits = async (habits) => {
  try {
    const fileUri = FileSystem.documentDirectory + 'habits.json';
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(habits));
  } catch (error) {
    console.error('Error saving habits:', error);
  }
};

export const clearStorage = async () => {
  try {
    const fileUri = FileSystem.documentDirectory + 'habits.json';
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(fileUri);
    }
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};