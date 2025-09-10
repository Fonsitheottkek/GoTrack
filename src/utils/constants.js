// src/utils/constants.js
export const lightColors = {
  primary: '#3498db',
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#2c3e50',
  textSecondary: '#7f8c8d',
  border: '#e9ecef',
  notification: '#ff4757',
};

export const darkColors = {
  primary: '#3498db',
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#bdc3c7',
  border: '#2d2d2d',
  notification: '#ff4757',
};

export const HABIT_FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export const HABIT_CATEGORIES = [
  { value: 'health', label: 'Health', icon: 'fitness' },
  { value: 'work', label: 'Work', icon: 'briefcase' },
  { value: 'learning', label: 'Learning', icon: 'school' },
  { value: 'personal', label: 'Personal', icon: 'person' },
  { value: 'social', label: 'Social', icon: 'people' },
  { value: 'financial', label: 'Financial', icon: 'cash' },
];