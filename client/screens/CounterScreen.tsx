import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Spacing } from "@/constants/theme";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CounterScreen() {
  const insets = useSafeAreaInsets();
  const [count, setCount] = useState(0);
  const plusScale = useSharedValue(1);
  const minusScale = useSharedValue(1);

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setCount((prev) => Math.max(0, prev - 1));
  };

  const plusAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: plusScale.value }],
  }));

  const minusAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: minusScale.value }],
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
});
