import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@/screens/HomeScreen";
import CounterScreen from "@/screens/CounterScreen";

export type RootStackParamList = {
  Home: undefined;
  Counter: { dhikrText: string };
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
        options={({ route }) => ({
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
        })}
      />
    </Stack.Navigator>
  );
}
