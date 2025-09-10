// src/components/Statistics/Charts.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const Charts = ({ habits }) => {
  const { colors } = useTheme();

  if (habits.length === 0) return null;

  // Prepare data for charts
  const completionData = {
    labels: ['Completed', 'Pending'],
    data: [
      habits.filter(h => h.completed).length,
      habits.filter(h => !h.completed).length
    ],
    colors: ['#4caf50', '#ff9800']
  };

  const streakData = {
    labels: habits.map(h => h.name.substring(0, 10) + (h.name.length > 10 ? '...' : '')),
    datasets: [{
      data: habits.map(h => h.streak)
    }]
  };

  const categoryData = habits.reduce((acc, habit) => {
    const category = habit.category || 'uncategorized';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {});

  const pieChartData = Object.entries(categoryData).map(([name, value], index) => ({
    name,
    value,
    color: `hsl(${index * 45}, 70%, 60%)`,
    legendFontColor: colors.text,
    legendFontSize: 12
  }));

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: (opacity = 1) => `rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForLabels: {
      fill: colors.text
    }
  };

  return (
    <View style={styles.container}>
      {/* Completion Rate Chart */}
      <View style={[styles.chartSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>Completion Rate</Text>
        <PieChart
          data={[
            {
              name: 'Completed',
              value: completionData.data[0],
              color: completionData.colors[0],
              legendFontColor: colors.text,
              legendFontSize: 12
            },
            {
              name: 'Pending',
              value: completionData.data[1],
              color: completionData.colors[1],
              legendFontColor: colors.text,
              legendFontSize: 12
            }
          ]}
          width={screenWidth - 64}
          height={160}
          chartConfig={chartConfig}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* Streak Chart */}
      {habits.some(h => h.streak > 0) && (
        <View style={[styles.chartSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Current Streaks</Text>
          <BarChart
            data={streakData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            fromZero
            showValuesOnTopOfBars
          />
        </View>
      )}

      {/* Category Distribution */}
      {pieChartData.length > 0 && (
        <View style={[styles.chartSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Habits by Category</Text>
          <PieChart
            data={pieChartData}
            width={screenWidth - 64}
            height={200}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </View>
      )}

      {/* Weekly Progress (simplified) */}
      <View style={[styles.chartSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>Weekly Progress</Text>
        <View style={styles.weeklyProgress}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const progress = Math.random() * 100; // Simulated data
            return (
              <View key={day} style={styles.dayProgress}>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { 
                        height: `${progress}%`,
                        backgroundColor: progress > 70 ? '#4caf50' : progress > 30 ? '#ff9800' : '#f44336'
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.dayLabel, { color: colors.text }]}>{day}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  chartSection: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  weeklyProgress: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    width: '100%',
  },
  dayProgress: {
    alignItems: 'center',
    gap: 8,
  },
  progressBarContainer: {
    height: 150,
    width: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  progressBar: {
    width: '100%',
    borderRadius: 10,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Charts;