import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Spacing } from "@/constants/theme";

const DEFAULT_DHIKR_LIST = [
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

  const [dhikrList, setDhikrList] = useState<string[]>(DEFAULT_DHIKR_LIST);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customDhikr, setCustomDhikr] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    loadDhikrList();
  }, []);

  const loadDhikrList = async () => {
    try {
      const stored = await AsyncStorage.getItem("dhikrList");
      if (stored) {
        setDhikrList(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load dhikr list:", error);
    }
  };

  const saveDhikrList = async (newList: string[]) => {
    try {
      setDhikrList(newList);
      await AsyncStorage.setItem("dhikrList", JSON.stringify(newList));
    } catch (error) {
      console.error("Failed to save dhikr list:", error);
    }
  };

  const handleDhikrPress = (dhikrText: string) => {
    navigation.navigate("Counter", { dhikrText });
  };

  const handleLongPress = (index: number) => {
    setEditingIndex(index);
    setCustomDhikr(dhikrList[index]);
    setShowCustomModal(true);
  };

  const handleSaveModal = () => {
    if (!customDhikr.trim()) return;

    if (editingIndex !== null) {
      // Edit existing
      const newList = [...dhikrList];
      newList[editingIndex] = customDhikr.trim();
      saveDhikrList(newList);
    } else {
      // Add new
      const newList = [...dhikrList, customDhikr.trim()];
      saveDhikrList(newList);
    }
    setShowCustomModal(false);
  };

  const handleDelete = () => {
    if (editingIndex !== null) {
      const newList = dhikrList.filter((_, i) => i !== editingIndex);
      saveDhikrList(newList);
    }
    setShowCustomModal(false);
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
          {dhikrList.map((dhikr, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => handleDhikrPress(dhikr)}
              onLongPress={() => handleLongPress(index)}
            >
              <Text style={styles.buttonText}>{dhikr}</Text>
            </Pressable>
          ))}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              setEditingIndex(null);
              setCustomDhikr("");
              setShowCustomModal(true);
            }}
          >
            <Text style={styles.buttonText}>إضافة (Add New)</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={showCustomModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCustomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingIndex !== null ? "تعديل الذكر (Edit)" : "إضافة ذكر جديد (New)"}
            </Text>
            <TextInput
              style={styles.input}
              value={customDhikr}
              onChangeText={setCustomDhikr}
              placeholder="اكتب الذكر هنا..."
              placeholderTextColor="#999"
              textAlign="center"
              autoFocus
            />
            <View style={styles.modalButtons}>
              {editingIndex !== null && (
                <Pressable
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={handleDelete}
                >
                  <Text style={styles.deleteButtonText}>حذف (Delete)</Text>
                </Pressable>
              )}
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCustomModal(false)}
              >
                <Text style={styles.cancelButtonText}>إلغاء (Cancel)</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveModal}
              >
                <Text style={styles.saveButtonText}>حفظ (Save)</Text>
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
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  input: {
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
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  cancelButtonText: {
    color: "#666666",
    fontWeight: "600",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
