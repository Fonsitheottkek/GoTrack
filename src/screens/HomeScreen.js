// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from '../contexts/ThemeContext';
import { useHabits } from '../contexts/HabitContext';
import HabitList from '../components/HabitList/HabitList';
import HabitForm from '../components/HabitForm/HabitForm';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const { colors } = useTheme();
  const { habits, setIsFormVisible } = useHabits();

  const completedHabits = habits.filter(habit => habit.completed).length;
  const totalHabits = habits.length;
  const completionPercentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        
        {/* Header Section with Greeting and Progress */}
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <View style={styles.greetingContainer}>
            <Text style={[styles.greeting, { color: colors.text }]}>
              {getGreeting()}! 👋
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              What's on your mind today?
            </Text>
          </View>

          {/* Progress Bar */}
          {totalHabits > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressText, { color: colors.text }]}>
                  Today's Progress
                </Text>
                <Text style={[styles.progressPercentage, { color: colors.primary }]}>
                  {Math.round(completionPercentage)}%
                </Text>
              </View>
              
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${completionPercentage}%`,
                      backgroundColor: colors.primary
                    }
                  ]} 
                />
              </View>
              
              <Text style={[styles.progressStats, { color: colors.textSecondary }]}>
                {completedHabits} of {totalHabits} habits completed
              </Text>
            </View>
          )}
        </View>

        {/* Quick Add Button */}
        {habits.length === 0 && (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Ionicons name="add-circle" size={64} color={colors.primary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Start Your Journey
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Add your first habit to begin tracking your progress
            </Text>
            <TouchableOpacity
              style={[styles.quickAddButton, { backgroundColor: colors.primary }]}
              onPress={() => setIsFormVisible(true)}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.quickAddText}>Add First Habit</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Habits List */}
        <HabitList />
        
        {/* Habit Form Modal */}
        <HabitForm />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  greetingContainer: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  progressContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease-in-out',
  },
  progressStats: {
    fontSize: 12,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 20,
    margin: 16,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  quickAddText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default HomeScreen;