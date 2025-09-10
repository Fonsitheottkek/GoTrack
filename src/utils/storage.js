// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = '@habits';

export const loadHabits = async () => {
  try {
    const storedHabits = await AsyncStorage.getItem(HABITS_KEY);
    return storedHabits ? JSON.parse(storedHabits) : [];
  } catch (error) {
    console.error('Error loading habits:', error);
    return [];
  }
};

export const saveHabits = async (habits) => {
  try {
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error('Error saving habits:', error);
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};