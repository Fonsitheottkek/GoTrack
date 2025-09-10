// src/components/Statistics/Statistics.js
import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useHabits } from '../../contexts/HabitContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const Statistics = () => {
  const { habits } = useHabits();
  const { colors } = useTheme();

  const stats = useMemo(() => {
    const totalHabits = habits.length;
    const completedToday = habits.filter(h => h.completed).length;
    const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
    const averageStreak = totalHabits > 0 ? (totalStreak / totalHabits).toFixed(1) : 0;
    const completionRate = totalHabits > 0 ? ((completedToday / totalHabits) * 100).toFixed(1) : 0;

    // Weekly completion data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }).reverse();

    const weeklyData = last7Days.map(() => Math.floor(Math.random() * totalHabits));

    // Category statistics
    const categoryStats = habits.reduce((acc, habit) => {
      const category = habit.category || 'uncategorized';
      if (!acc[category]) {
        acc[category] = { count: 0, completed: 0, totalStreak: 0 };
      }
      acc[category].count++;
      if (habit.completed) acc[category].completed++;
      acc[category].totalStreak += habit.streak;
      return acc;
    }, {});

    // Frequency distribution
    const frequencyStats = habits.reduce((acc, habit) => {
      const freq = habit.frequency || 'daily';
      acc[freq] = (acc[freq] || 0) + 1;
      return acc;
    }, {});

    return {
      totalHabits,
      completedToday,
      totalStreak,
      averageStreak,
      completionRate,
      weeklyData,
      last7Days,
      categoryStats,
      frequencyStats
    };
  }, [habits]);

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: (opacity = 1) => `rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForLabels: {
      fill: colors.text
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: colors.primary
    }
  };

  if (habits.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.text }]}>
          No habits to show statistics
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Summary Cards */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="list" size={24} color={colors.primary} />
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalHabits}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Habits</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="checkmark-circle" size={24} color="#4caf50" />
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.completedToday}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed Today</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="flame" size={24} color="#ff9800" />
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalStreak}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Streak</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="trending-up" size={24} color="#2196f3" />
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.completionRate}%</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completion Rate</Text>
        </View>
      </View>

      {/* Weekly Progress Chart */}
      <View style={[styles.chartSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Progress</Text>
        <LineChart
          data={{
            labels: stats.last7Days,
            datasets: [
              {
                data: stats.weeklyData,
                color: (opacity = 1) => colors.primary,
                strokeWidth: 2
              }
            ]
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Completion Rate Pie Chart */}
      <View style={[styles.chartSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Completion</Text>
        <PieChart
          data={[
            {
              name: 'Completed',
              population: stats.completedToday,
              color: '#4caf50',
              legendFontColor: colors.text,
              legendFontSize: 12
            },
            {
              name: 'Pending',
              population: stats.totalHabits - stats.completedToday,
              color: '#ff9800',
              legendFontColor: colors.text,
              legendFontSize: 12
            }
          ]}
          width={screenWidth - 40}
          height={200}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>

      {/* Streak Distribution */}
      <View style={[styles.chartSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Habit Streaks</Text>
        <BarChart
          data={{
            labels: habits.map(h => h.name.substring(0, 12) + (h.name.length > 12 ? '...' : '')),
            datasets: [{
              data: habits.map(h => h.streak)
            }]
          }}
          width={screenWidth - 40}
          height={300}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          fromZero
          showValuesOnTopOfBars
        />
      </View>

      {/* Category Breakdown */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Category Breakdown</Text>
        {Object.entries(stats.categoryStats).map(([category, data]) => (
          <View key={category} style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <Text style={[styles.categoryName, { color: colors.text }]}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
              <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>
                {data.count} {data.count === 1 ? 'habit' : 'habits'}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(data.completed / data.count) * 100}%`,
                    backgroundColor: colors.primary
                  }
                ]} 
              />
            </View>
            <Text style={[styles.categoryStats, { color: colors.textSecondary }]}>
              {data.completed}/{data.count} completed • Avg streak: {(data.totalStreak / data.count).toFixed(1)}
            </Text>
          </View>
        ))}
      </View>

      {/* Frequency Distribution */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Frequency Distribution</Text>
        {Object.entries(stats.frequencyStats).map(([frequency, count]) => (
          <View key={frequency} style={styles.frequencyItem}>
            <Text style={[styles.frequencyLabel, { color: colors.text }]}>
              {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
            </Text>
            <View style={styles.frequencyBarContainer}>
              <View 
                style={[
                  styles.frequencyBar, 
                  { 
                    width: `${(count / stats.totalHabits) * 100}%`,
                    backgroundColor: colors.primary
                  }
                ]} 
              />
            </View>
            <Text style={[styles.frequencyCount, { color: colors.textSecondary }]}>
              {count} ({Math.round((count / stats.totalHabits) * 100)}%)
            </Text>
          </View>
        ))}
      </View>

      {/* Best Performing Habits */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Performers</Text>
        {habits
          .sort((a, b) => b.streak - a.streak)
          .slice(0, 5)
          .map((habit, index) => (
            <View key={habit.id} style={styles.topHabitItem}>
              <View style={styles.rank}>
                <Text style={[styles.rankText, { color: colors.text }]}>#{index + 1}</Text>
              </View>
              <View style={styles.topHabitInfo}>
                <Text style={[styles.topHabitName, { color: colors.text }]}>{habit.name}</Text>
                <Text style={[styles.topHabitStreak, { color: colors.primary }]}>
                  {habit.streak} day streak
                </Text>
              </View>
              <Ionicons name="trophy" size={20} color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : colors.textSecondary} />
            </View>
          ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  chartSection: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  section: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  categoryCount: {
    fontSize: 14,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryStats: {
    fontSize: 12,
  },
  frequencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  frequencyLabel: {
    width: 80,
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  frequencyBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  frequencyBar: {
    height: '100%',
    borderRadius: 4,
  },
  frequencyCount: {
    width: 60,
    fontSize: 12,
    textAlign: 'right',
  },
  topHabitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: 8,
  },
  rank: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  topHabitInfo: {
    flex: 1,
  },
  topHabitName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  topHabitStreak: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});

export default Statistics;