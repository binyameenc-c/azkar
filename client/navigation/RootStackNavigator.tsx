import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HeaderButton } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "@/screens/HomeScreen";
import CounterScreen from "@/screens/CounterScreen";
import StatsScreen from "@/screens/StatsScreen";

export type RootStackParamList = {
  Home: undefined;
  Counter: { dhikrText: string };
  Stats: { dhikrText: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Counter"
        component={CounterScreen}
        options={({ route, navigation }) => ({
          headerTitle: route.params.dhikrText,
          headerTintColor: "#4CAF50",
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerTitleStyle: {
            color: "#4CAF50",
            fontSize: 18,
            fontWeight: "600",
          },
          headerRight: () => (
            <HeaderButton
              onPress={() => navigation.navigate("Stats", { dhikrText: route.params.dhikrText })}
              pressColor="rgba(76, 175, 80, 0.2)"
            >
              <Ionicons name="stats-chart" size={22} color="#4CAF50" />
            </HeaderButton>
          ),
        })}
      />
      <Stack.Screen
        name="Stats"
        component={StatsScreen}
        options={({ route }) => ({
          headerTitle: "Statistics",
          headerTintColor: "#4CAF50",
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerTitleStyle: {
            color: "#4CAF50",
            fontSize: 18,
            fontWeight: "600",
          },
        })}
      />
    </Stack.Navigator>
  );
}
