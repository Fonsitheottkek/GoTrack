// src/components/HabitList/HabitList.js
import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useHabits } from '../../contexts/HabitContext';
import { useTheme } from '../../contexts/ThemeContext';
import HabitItem from './HabitItem';
import EmptyState from '../Common/EmptyState';
import { Ionicons } from '@expo/vector-icons';

const HabitList = () => {
  const { habits, setIsFormVisible } = useHabits();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <HabitItem habit={item} />}
        contentContainerStyle={styles.listContent}
        
      />
      
      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setIsFormVisible(true)}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default HabitList;