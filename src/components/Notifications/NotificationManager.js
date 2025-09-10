// src/components/Notifications/NotificationManager.js
import React, { useEffect } from 'react';
import { useHabits } from '../../contexts/HabitContext';

const NotificationManager = () => {
  const { habits } = useHabits();

  useEffect(() => {
    // Notification logic will go here
    console.log('Notification manager mounted');
  }, [habits]);

  return null;
};

export default NotificationManager; // Default export