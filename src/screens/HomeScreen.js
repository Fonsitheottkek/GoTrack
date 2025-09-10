// src/screens/HomeScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from '../contexts/ThemeContext';
import { useHabits } from '../contexts/HabitContext';
import { useProfile } from '../contexts/ProfileContext';
import HabitForm from '../components/HabitForm/HabitForm';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const { colors } = useTheme();
  const { habits, setIsFormVisible, toggleHabitCompletion, updateHabit, deleteHabit } = useHabits();
  const { profileData } = useProfile();
  const [selectedDate, setSelectedDate] = useState(23);
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Generate current month data
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  
  const weeks = [
    [null, null, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, null, null, null]
  ];

  const getUserName = () => {
    if (!profileData?.name || profileData.name === 'User') return 'User';
    return profileData.name.split(' ')[0];
  };

  const todayHabits = habits;

  const startEditing = (habit) => {
    setEditingHabitId(habit.id);
    setEditName(habit.name);
    setEditDescription(habit.description || '');
  };

  const saveEdit = () => {
    if (editName.trim()) {
      updateHabit(editingHabitId, {
        name: editName.trim(),
        description: editDescription.trim()
      });
    }
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingHabitId(null);
    setEditName('');
    setEditDescription('');
  };

  const handleDelete = (habitId, habitName) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habitName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(habitId) },
      ]
    );
  };

  const renderCalendarDay = (day, rowIndex, colIndex) => {
    const isSelected = day === selectedDate;
    const isToday = day === 23;
    
    return (
      <TouchableOpacity
        key={`${rowIndex}-${colIndex}`}
        style={[
          styles.calendarDay,
          isSelected && { backgroundColor: colors.primary },
          isToday && !isSelected && { borderWidth: 2, borderColor: colors.primary }
        ]}
        onPress={() => day && setSelectedDate(day)}
        disabled={!day}
      >
        <Text style={[
          styles.dayText,
          { color: day ? colors.text : 'transparent' },
          isSelected && styles.selectedDayText
        ]}>
          {day || ''}
        </Text>
        {isToday && !isSelected && (
          <View style={[styles.todayIndicator, { backgroundColor: colors.primary }]} />
        )}
      </TouchableOpacity>
    );
  };

  const renderHabitItem = ({ item }) => (
    <View style={[styles.habitItem, { backgroundColor: colors.card }]}>
      {editingHabitId === item.id ? (
        // Edit Mode
        <View style={styles.editContainer}>
          <TextInput
            style={[styles.editInput, { color: colors.text, borderColor: colors.border }]}
            value={editName}
            onChangeText={setEditName}
            placeholder="Habit name"
            placeholderTextColor={colors.textSecondary}
            autoFocus
          />
          <TextInput
            style={[styles.editInput, styles.editDescription, { color: colors.text, borderColor: colors.border }]}
            value={editDescription}
            onChangeText={setEditDescription}
            placeholder="Description (optional)"
            placeholderTextColor={colors.textSecondary}
            multiline
          />
          <View style={styles.editButtons}>
            <TouchableOpacity onPress={cancelEdit} style={[styles.editButton, styles.cancelButton]}>
              <Text style={[styles.editButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={saveEdit} style={[styles.editButton, styles.saveButton]}>
              <Text style={styles.editButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // View Mode
        <>
          <TouchableOpacity onPress={() => toggleHabitCompletion(item.id)} style={styles.habitContent}>
            <View style={[
              styles.checkbox,
              { borderColor: colors.border },
              item.completed && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}>
              {item.completed && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            
            <View style={styles.habitInfo}>
              <Text style={[
                styles.habitName,
                { color: colors.text },
                item.completed && styles.completedText
              ]}>
                {item.name}
              </Text>
              
              {item.description && (
                <Text style={[styles.habitDescription, { color: colors.textSecondary }]}>
                  {item.description}
                </Text>
              )}
              
              <View style={styles.habitMeta}>
                <Text style={[styles.streakText, { color: colors.primary }]}>
                  🔥 {item.streak} days
                </Text>
                <Text style={[styles.frequencyText, { color: colors.textSecondary }]}>
                  {item.frequency}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => startEditing(item)} style={styles.editIcon}>
              <Ionicons name="create-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id, item.name)} style={styles.deleteIcon}>
              <Ionicons name="trash-outline" size={20} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.card }]}>
            <View>
              <Text style={[styles.greeting, { color: colors.text }]}>
                Hello, {getUserName()}
              </Text>
              <Text style={[styles.date, { color: colors.textSecondary }]}>
                {currentMonth}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => setIsFormVisible(true)}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Calendar Grid */}
            <View style={[styles.calendarContainer, { backgroundColor: colors.card }]}>
              <View style={styles.weekDaysRow}>
                {weekDays.map((day, index) => (
                  <Text key={index} style={[styles.weekDayText, { color: colors.textSecondary }]}>
                    {day}
                  </Text>
                ))}
              </View>

              {weeks.map((week, rowIndex) => (
                <View key={rowIndex} style={styles.calendarRow}>
                  {week.map((day, colIndex) => renderCalendarDay(day, rowIndex, colIndex))}
                </View>
              ))}
            </View>

            {/* Today's Habits */}
            <View style={styles.habitsSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Today's Habits
                </Text>
                <Text style={[styles.habitsCount, { color: colors.textSecondary }]}>
                  {todayHabits.length} tasks
                </Text>
              </View>

              {todayHabits.length > 0 ? (
                <View style={styles.habitsList}>
                  {todayHabits.map((item) => (
                    <View key={item.id}>
                      {renderHabitItem({ item })}
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyHabits}>
                  <Ionicons name="checkmark-done" size={48} color={colors.textSecondary} />
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    All caught up for today!
                  </Text>
                  <TouchableOpacity
                    style={[styles.addFirstButton, { backgroundColor: colors.primary }]}
                    onPress={() => setIsFormVisible(true)}
                  >
                    <Text style={styles.addFirstText}>Add Your First Habit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>

          <HabitForm />
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    marginTop: 2,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarContainer: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '500',
    width: 32,
    textAlign: 'center',
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  calendarDay: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  todayIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  habitsSection: {
    margin: 16,
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  habitsCount: {
    fontSize: 14,
  },
  habitsList: {
    paddingBottom: 100,
  },
  habitItem: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  actionButtons: {
    flexDirection: 'row',
    paddingRight: 16,
    gap: 12,
  },
  editIcon: {
    padding: 8,
  },
  deleteIcon: {
    padding: 8,
  },
  emptyHabits: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  addFirstButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  addFirstText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  // Edit Mode Styles
  editContainer: {
    padding: 16,
    flex: 1,
  },
  editInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  editDescription: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default HomeScreen;