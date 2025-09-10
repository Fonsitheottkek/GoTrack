// src/components/HabitList/HabitItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../../contexts/HabitContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Swipeable } from 'react-native-gesture-handler';

const HabitItem = ({ habit }) => {
  const { colors } = useTheme();
  const { toggleHabitCompletion, deleteHabit, setSelectedHabit, setIsFormVisible } = useHabits();

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(habit.id) },
      ]
    );
  };

  const handleEdit = () => {
    setSelectedHabit(habit);
    setIsFormVisible(true);
  };

  const handleToggle = () => {
    toggleHabitCompletion(habit.id);
  };

  const renderRightActions = () => (
    <View style={styles.actions}>
      <TouchableOpacity onPress={handleEdit} style={[styles.actionButton, styles.editButton]}>
        <Ionicons name="create-outline" size={20} color="white" />
        <Text style={styles.actionButtonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDelete} style={[styles.actionButton, styles.deleteButton]}>
        <Ionicons name="trash-outline" size={20} color="white" />
        <Text style={styles.actionButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={[styles.habitItem, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={handleToggle} style={styles.habitContent}>
          <View style={[
            styles.checkbox,
            { borderColor: colors.border },
            habit.completed && { backgroundColor: colors.primary, borderColor: colors.primary }
          ]}>
            {habit.completed && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
          
          <View style={styles.habitInfo}>
            <Text style={[
              styles.habitName,
              { color: colors.text },
              habit.completed && styles.completedText
            ]}>
              {habit.name}
            </Text>
            
            {habit.description && (
              <Text style={[styles.habitDescription, { color: colors.textSecondary }]}>
                {habit.description}
              </Text>
            )}
            
            <View style={styles.habitMeta}>
              <Text style={[styles.streakText, { color: colors.primary }]}>
                🔥 {habit.streak} days
              </Text>
              <Text style={[styles.frequencyText, { color: colors.textSecondary }]}>
                {habit.frequency}
              </Text>
              {habit.reminderTime && (
                <View style={styles.timeBadge}>
                  <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                  <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                    {habit.reminderTime}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Edit Button (visible always) */}
        <TouchableOpacity onPress={handleEdit} style={styles.quickEditButton}>
          <Ionicons name="create-outline" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  habitItem: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  habitDescription: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  habitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  streakText: {
    fontSize: 12,
    fontWeight: '500',
  },
  frequencyText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
  },
  quickEditButton: {
    padding: 12,
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  actionButton: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default HabitItem;