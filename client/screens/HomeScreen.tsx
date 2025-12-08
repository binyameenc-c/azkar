import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Spacing } from "@/constants/theme";

const DHIKR_LIST = [
  "لا اله الا الله",
  "سبحان الله",
  "صلاة على نبي",
  "استغفار",
  "الله اكبر",
  "الحمد لله",
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const handleDhikrPress = (dhikrText: string) => {
    navigation.navigate("Counter", { dhikrText });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 60,
            paddingBottom: insets.bottom + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>أذكار</Text>
        <View style={styles.buttonsContainer}>
          {DHIKR_LIST.map((dhikr, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => handleDhikrPress(dhikr)}
            >
              <Text style={styles.buttonText}>{dhikr}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4CAF50",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: Spacing["3xl"],
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    gap: Spacing.lg,
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing["5xl"],
    borderRadius: 25,
    width: "80%",
    maxWidth: 320,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4CAF50",
  },
});
