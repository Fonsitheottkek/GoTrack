// src/utils/notifications.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotifications = async () => {
  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
};

export const scheduleAllNotifications = async (habits) => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const habit of habits) {
    if (habit.reminderTime) {
      await scheduleNotification(habit);
    }
  }
};

export const scheduleNotification = async (habit) => {
  const [hours, minutes] = habit.reminderTime.split(':').map(Number);
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Habit Reminder',
      body: `Don't forget to ${habit.name}!`,
      data: { habitId: habit.id },
    },
    trigger: {
      hour: hours,
      minute: minutes,
      repeats: true,
    },
  });
};  