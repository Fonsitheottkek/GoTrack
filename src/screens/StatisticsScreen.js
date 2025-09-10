// src/screens/StatisticsScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Common/Header';
import Statistics from '../components/Statistics/Statistics';

const StatisticsScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Statistics />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default StatisticsScreen; // Default export