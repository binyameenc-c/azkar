import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Spacing } from "@/constants/theme";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type CounterScreenRouteProp = RouteProp<RootStackParamList, "Counter">;

const getStorageKey = (dhikrText: string) => `dhikr_count_${dhikrText}`;

export default function CounterScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<CounterScreenRouteProp>();
  const { dhikrText } = route.params;
  
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const plusScale = useSharedValue(1);
  const minusScale = useSharedValue(1);
  const resetScale = useSharedValue(1);

  useEffect(() => {
    loadCount();
  }, [dhikrText]);

  const loadCount = async () => {
    try {
      const storedCount = await AsyncStorage.getItem(getStorageKey(dhikrText));
      if (storedCount !== null) {
        setCount(parseInt(storedCount, 10));
      }
    } catch (error) {
      console.error("Error loading count:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCount = async (newCount: number) => {
    try {
      await AsyncStorage.setItem(getStorageKey(dhikrText), newCount.toString());
    } catch (error) {
      console.error("Error saving count:", error);
    }
  };

  const handleIncrement = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newCount = count + 1;
    setCount(newCount);
    saveCount(newCount);
  }, [count, dhikrText]);

  const handleDecrement = useCallback(async () => {
    if (count > 0) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newCount = count - 1;
      setCount(newCount);
      saveCount(newCount);
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
            setCount(0);
            saveCount(0);
          },
        },
      ]
    );
  }, [dhikrText]);

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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.label}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>You have pushed the button this many times:</Text>
        <Text style={styles.count}>{count}</Text>
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
  label: {
    fontSize: 18,
    color: "#666666",
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  count: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#4CAF50",
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
});
