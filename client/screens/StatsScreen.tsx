import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Spacing } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { getHistory, getGoal, DhikrHistory } from "@/lib/storage";

type StatsScreenRouteProp = RouteProp<RootStackParamList, "Stats">;

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<StatsScreenRouteProp>();
  const { dhikrText } = route.params;
  
  const [history, setHistory] = useState<DhikrHistory>({ totalCount: 0, dailyStats: [] });
  const [goal, setGoal] = useState(33);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [dhikrText]);

  const loadStats = async () => {
    try {
      const [storedHistory, storedGoal] = await Promise.all([
        getHistory(dhikrText),
        getGoal(dhikrText),
      ]);
      setHistory(storedHistory);
      setGoal(storedGoal);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getStreakCount = () => {
    if (history.dailyStats.length === 0) return 0;
    
    let streak = 0;
    const sortedStats = [...history.dailyStats].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    for (const stat of sortedStats) {
      if (stat.count >= goal) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getAverageCount = () => {
    if (history.dailyStats.length === 0) return 0;
    const total = history.dailyStats.reduce((sum, stat) => sum + stat.count, 0);
    return Math.round(total / history.dailyStats.length);
  };

  const getBestDay = () => {
    if (history.dailyStats.length === 0) return { date: "N/A", count: 0 };
    const best = history.dailyStats.reduce((max, stat) => 
      stat.count > max.count ? stat : max
    , history.dailyStats[0]);
    return best;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading statistics...</Text>
        </View>
      </View>
    );
  }

  const streak = getStreakCount();
  const average = getAverageCount();
  const bestDay = getBestDay();

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: insets.bottom + Spacing.xl }
      ]}
    >
      <Text style={styles.dhikrTitle}>{dhikrText}</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={28} color="#FF6B35" />
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="stats-chart" size={28} color="#4CAF50" />
          <Text style={styles.statValue}>{average}</Text>
          <Text style={styles.statLabel}>Daily Average</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={28} color="#FFD700" />
          <Text style={styles.statValue}>{bestDay.count}</Text>
          <Text style={styles.statLabel}>Best Day</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="infinite" size={28} color="#2196F3" />
          <Text style={styles.statValue}>{history.totalCount}</Text>
          <Text style={styles.statLabel}>Total Count</Text>
        </View>
      </View>
      
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Recent History</Text>
        {history.dailyStats.length === 0 ? (
          <View style={styles.emptyHistory}>
            <Ionicons name="calendar-outline" size={48} color="#CCCCCC" />
            <Text style={styles.emptyText}>No history yet</Text>
            <Text style={styles.emptySubtext}>Start counting to see your progress</Text>
          </View>
        ) : (
          [...history.dailyStats]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((stat, index) => (
              <View key={stat.date} style={styles.historyRow}>
                <Text style={styles.historyDate}>{formatDate(stat.date)}</Text>
                <View style={styles.historyBarContainer}>
                  <View 
                    style={[
                      styles.historyBar,
                      { width: `${Math.min((stat.count / goal) * 100, 100)}%` },
                      stat.count >= goal ? styles.goalReached : null
                    ]} 
                  />
                </View>
                <Text style={styles.historyCount}>{stat.count}</Text>
              </View>
            ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
  },
  dhikrTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    width: "47%",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: Spacing.lg,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    marginTop: Spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    marginTop: Spacing.xs,
  },
  historySection: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: Spacing.lg,
  },
  emptyHistory: {
    alignItems: "center",
    paddingVertical: Spacing.xl * 2,
  },
  emptyText: {
    fontSize: 16,
    color: "#999999",
    marginTop: Spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#CCCCCC",
    marginTop: Spacing.xs,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  historyDate: {
    width: 60,
    fontSize: 12,
    color: "#666666",
  },
  historyBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginHorizontal: Spacing.md,
    overflow: "hidden",
  },
  historyBar: {
    height: "100%",
    backgroundColor: "#81C784",
    borderRadius: 4,
  },
  goalReached: {
    backgroundColor: "#4CAF50",
  },
  historyCount: {
    width: 40,
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    textAlign: "right",
  },
});
