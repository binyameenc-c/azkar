import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, Alert, TextInput, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Spacing } from "@/constants/theme";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import {
  getCount,
  setCount,
  getDailyCount,
  incrementDailyCount,
  getGoal,
  setGoal,
  addToHistory,
  resetDailyCount,
} from "@/lib/storage";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type CounterScreenRouteProp = RouteProp<RootStackParamList, "Counter">;

export default function CounterScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<CounterScreenRouteProp>();
  const { dhikrText } = route.params;
  
  const [count, setCountState] = useState(0);
  const [dailyCount, setDailyCountState] = useState(0);
  const [goal, setGoalState] = useState(33);
  const [isLoading, setIsLoading] = useState(true);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  
  const plusScale = useSharedValue(1);
  const minusScale = useSharedValue(1);
  const resetScale = useSharedValue(1);

  useEffect(() => {
    loadData();
  }, [dhikrText]);

  const loadData = async () => {
    try {
      const [storedCount, storedDailyCount, storedGoal] = await Promise.all([
        getCount(dhikrText),
        getDailyCount(dhikrText),
        getGoal(dhikrText),
      ]);
      setCountState(storedCount);
      setDailyCountState(storedDailyCount);
      setGoalState(storedGoal);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newCount = count + 1;
    setCountState(newCount);
    await setCount(dhikrText, newCount);
    
    const newDailyCount = await incrementDailyCount(dhikrText);
    setDailyCountState(newDailyCount);
    await addToHistory(dhikrText, newDailyCount);
    
    if (newDailyCount === goal) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Goal Reached!", `You've completed your daily goal of ${goal}!`);
    }
  }, [count, dhikrText, goal]);

  const handleDecrement = useCallback(async () => {
    if (count > 0) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newCount = count - 1;
      setCountState(newCount);
      await setCount(dhikrText, newCount);
    }
  }, [count, dhikrText]);

  const handleReset = useCallback(() => {
    Alert.alert(
      "Reset Counter",
      "Are you sure you want to reset this counter to 0?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            setCountState(0);
            setDailyCountState(0);
            await setCount(dhikrText, 0);
            await resetDailyCount(dhikrText);
          },
        },
      ]
    );
  }, [dhikrText]);

  const handleSetGoal = async () => {
    const newGoal = parseInt(goalInput, 10);
    if (newGoal > 0) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await setGoal(dhikrText, newGoal);
      setGoalState(newGoal);
      setShowGoalModal(false);
      setGoalInput("");
    }
  };

  const openGoalModal = () => {
    setGoalInput(goal.toString());
    setShowGoalModal(true);
  };

  const plusAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: plusScale.value }],
  }));

  const minusAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: minusScale.value }],
  }));

  const resetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: resetScale.value }],
  }));

  const handlePlusPressIn = () => {
    plusScale.value = withSpring(0.95);
  };

  const handlePlusPressOut = () => {
    plusScale.value = withSpring(1);
  };

  const handleMinusPressIn = () => {
    minusScale.value = withSpring(0.95);
  };

  const handleMinusPressOut = () => {
    minusScale.value = withSpring(1);
  };

  const handleResetPressIn = () => {
    resetScale.value = withSpring(0.95);
  };

  const handleResetPressOut = () => {
    resetScale.value = withSpring(1);
  };

  const progressPercent = Math.min((dailyCount / goal) * 100, 100);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.dhikrTitle}>{dhikrText}</Text>
        <Text style={styles.count}>{count}</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Daily Progress</Text>
            <Pressable onPress={openGoalModal}>
              <Text style={styles.goalButton}>Goal: {goal}</Text>
            </Pressable>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>{dailyCount} / {goal}</Text>
        </View>
      </View>

      <View
        style={[
          styles.fabContainer,
          { bottom: insets.bottom + 20 },
        ]}
      >
        <AnimatedPressable
          style={[styles.fab, styles.fabPlus, plusAnimatedStyle]}
          onPress={handleIncrement}
          onPressIn={handlePlusPressIn}
          onPressOut={handlePlusPressOut}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </AnimatedPressable>

        <AnimatedPressable
          style={[styles.fab, styles.fabMinus, minusAnimatedStyle]}
          onPress={handleDecrement}
          onPressIn={handleMinusPressIn}
          onPressOut={handleMinusPressOut}
        >
          <Ionicons name="remove" size={24} color="#FFFFFF" />
        </AnimatedPressable>

        <AnimatedPressable
          style={[styles.fab, styles.fabReset, resetAnimatedStyle]}
          onPress={handleReset}
          onPressIn={handleResetPressIn}
          onPressOut={handleResetPressOut}
        >
          <Ionicons name="refresh" size={24} color="#FFFFFF" />
        </AnimatedPressable>
      </View>

      <Modal
        visible={showGoalModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Daily Goal</Text>
            <TextInput
              style={styles.goalInput}
              value={goalInput}
              onChangeText={setGoalInput}
              keyboardType="number-pad"
              placeholder="Enter goal"
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowGoalModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSetGoal}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  dhikrTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#666666",
  },
  count: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: Spacing.xl,
  },
  progressContainer: {
    width: "100%",
    maxWidth: 280,
    marginTop: Spacing.lg,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontSize: 14,
    color: "#666666",
  },
  goalButton: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#999999",
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  fabContainer: {
    position: "absolute",
    right: 20,
    gap: Spacing.lg,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  fabPlus: {
    backgroundColor: "#4CAF50",
  },
  fabMinus: {
    backgroundColor: "#F44336",
  },
  fabReset: {
    backgroundColor: "#FF9800",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: Spacing.xl,
    width: "80%",
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  goalInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: 18,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  modalButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButtonText: {
    color: "#666666",
    fontWeight: "600",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
