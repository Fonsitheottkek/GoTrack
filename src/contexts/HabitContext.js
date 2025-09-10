// src/contexts/HabitContext.js - Fix exports
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadHabits, saveHabits } from '../utils/storage';

const HabitContext = createContext();

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    loadHabits().then(setHabits);
  }, []);

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const addHabit = (habit) => {
    const newHabit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date(),
      completed: false,
      streak: 0,
      lastCompleted: null,
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const updateHabit = (id, updates) => {
    setHabits(prev => prev.map(habit =>
      habit.id === id ? { ...habit, ...updates } : habit
    ));
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const toggleHabitCompletion = (id) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const wasCompleted = habit.completed;
        return {
          ...habit,
          completed: !wasCompleted,
          streak: wasCompleted ? Math.max(0, habit.streak - 1) : habit.streak + 1,
        };
      }
      return habit;
    }));
  };

  const value = {
    habits,
    selectedHabit,
    isFormVisible,
    setSelectedHabit,
    setIsFormVisible,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};

// Remove any duplicate or incorrect exports