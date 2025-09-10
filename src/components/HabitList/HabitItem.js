// src/components/HabitList/HabitItem.js (Simplified version without swipe)
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../../contexts/HabitContext';
import { useTheme } from '../../contexts/ThemeContext';

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

  return (
    <View style={[styles.habitItem, { backgroundColor: colors.card }]}>
      <TouchableOpacity
        onPress={() => toggleHabitCompletion(habit.id)}
        style={styles.habitContent}
      >
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
          {habit.description ? (
            <Text style={[styles.habitDescription, { color: colors.textSecondary }]}>
              {habit.description}
            </Text>
          ) : null}
          <View style={styles.meta}>
            <Text style={[styles.streak, { color: colors.primary }]}>
              🔥 {habit.streak} day streak
            </Text>
            <Text style={[styles.frequency, { color: colors.textSecondary }]}>
              {habit.frequency}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      
      {/* Edit and Delete buttons without swipe */}
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={handleEdit} style={[styles.actionButton, styles.editButton]}>
          <Ionicons name="create-outline" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={[styles.actionButton, styles.deleteButton]}>
          <Ionicons name="trash-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
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
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streak: {
    fontSize: 12,
    fontWeight: '500',
  },
  frequency: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingRight: 16,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
});

export default HabitItem;