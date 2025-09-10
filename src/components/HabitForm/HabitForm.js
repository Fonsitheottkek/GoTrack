// src/components/HabitForm/HabitForm.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../../contexts/HabitContext';
import { useTheme } from '../../contexts/ThemeContext';
import { HABIT_FREQUENCIES, HABIT_CATEGORIES } from '../../utils/constants';

const HabitForm = () => {
  const { colors } = useTheme();
  const {
    selectedHabit,
    isFormVisible,
    setIsFormVisible,
    addHabit,
    updateHabit,
    setSelectedHabit
  } = useHabits();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'health',
    frequency: 'daily',
    reminderTime: '09:00',
    goal: '1'
  });

  useEffect(() => {
    if (selectedHabit) {
      setFormData({
        name: selectedHabit.name || '',
        description: selectedHabit.description || '',
        category: selectedHabit.category || 'health',
        frequency: selectedHabit.frequency || 'daily',
        reminderTime: selectedHabit.reminderTime || '09:00',
        goal: selectedHabit.goal?.toString() || '1'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'health',
        frequency: 'daily',
        reminderTime: '09:00',
        goal: '1'
      });
    }
  }, [selectedHabit]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    const habitData = {
      ...formData,
      goal: parseInt(formData.goal) || 1
    };

    if (selectedHabit) {
      updateHabit(selectedHabit.id, habitData);
    } else {
      addHabit(habitData);
    }

    handleClose();
  };

  const handleClose = () => {
    setSelectedHabit(null);
    setIsFormVisible(false);
  };

  const isEditing = !!selectedHabit;

  return (
    <Modal
      visible={isFormVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {isEditing ? 'Edit Habit' : 'New Habit'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <Text style={[styles.label, { color: colors.text }]}>Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Enter habit name"
              placeholderTextColor={colors.textSecondary}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />

            <Text style={[styles.label, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Optional description"
              placeholderTextColor={colors.textSecondary}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              multiline
            />

            <Text style={[styles.label, { color: colors.text }]}>Category</Text>
            <View style={styles.categoryGrid}>
              {HABIT_CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category.value}
                  style={[
                    styles.categoryButton,
                    { backgroundColor: colors.background, borderColor: colors.border },
                    formData.category === category.value && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, category: category.value }))}
                >
                  <Ionicons
                    name={category.icon}
                    size={20}
                    color={formData.category === category.value ? 'white' : colors.text}
                  />
                  <Text style={[
                    styles.categoryText,
                    { color: formData.category === category.value ? 'white' : colors.text }
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: colors.text }]}>Frequency</Text>
            <View style={styles.frequencyContainer}>
              {HABIT_FREQUENCIES.map(freq => (
                <TouchableOpacity
                  key={freq.value}
                  style={[
                    styles.frequencyButton,
                    { backgroundColor: colors.background, borderColor: colors.border },
                    formData.frequency === freq.value && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, frequency: freq.value }))}
                >
                  <Text style={[
                    styles.frequencyText,
                    { color: formData.frequency === freq.value ? 'white' : colors.text }
                  ]}>
                    {freq.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: colors.text }]}>Daily Goal</Text>
            <View style={styles.goalContainer}>
              <TextInput
                style={[styles.goalInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                keyboardType="numeric"
                value={formData.goal}
                onChangeText={(text) => setFormData(prev => ({ ...prev, goal: text }))}
              />
              <Text style={[styles.goalUnit, { color: colors.text }]}>times per day</Text>
            </View>

            <Text style={[styles.label, { color: colors.text }]}>Reminder Time</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="HH:MM"
              placeholderTextColor={colors.textSecondary}
              value={formData.reminderTime}
              onChangeText={(text) => setFormData(prev => ({ ...prev, reminderTime: text }))}
            />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: colors.border }]}
              onPress={handleClose}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>
                {isEditing ? 'Update Habit' : 'Create Habit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 100,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  frequencyButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 80,
  },
  frequencyText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  goalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: 80,
    textAlign: 'center',
  },
  goalUnit: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  submitButton: {
    backgroundColor: '#007bff',
  },
});

export default HabitForm;