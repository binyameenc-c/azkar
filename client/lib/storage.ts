import AsyncStorage from "@react-native-async-storage/async-storage";

const COUNTER_PREFIX = "dhikr_count_";
const DAILY_PREFIX = "dhikr_daily_";
const GOAL_PREFIX = "dhikr_goal_";
const HISTORY_PREFIX = "dhikr_history_";

export interface DailyStats {
  date: string;
  count: number;
}

export interface DhikrHistory {
  totalCount: number;
  dailyStats: DailyStats[];
}

const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const getStorageKey = (dhikrText: string) => `${COUNTER_PREFIX}${dhikrText}`;
export const getDailyKey = (dhikrText: string) => `${DAILY_PREFIX}${dhikrText}_${getTodayDateString()}`;
export const getGoalKey = (dhikrText: string) => `${GOAL_PREFIX}${dhikrText}`;
export const getHistoryKey = (dhikrText: string) => `${HISTORY_PREFIX}${dhikrText}`;

export async function getCount(dhikrText: string): Promise<number> {
  try {
    const stored = await AsyncStorage.getItem(getStorageKey(dhikrText));
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

export async function setCount(dhikrText: string, count: number): Promise<void> {
  try {
    await AsyncStorage.setItem(getStorageKey(dhikrText), count.toString());
  } catch (error) {
    console.error("Error saving count:", error);
  }
}

export async function getDailyCount(dhikrText: string): Promise<number> {
  try {
    const stored = await AsyncStorage.getItem(getDailyKey(dhikrText));
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

export async function setDailyCount(dhikrText: string, count: number): Promise<void> {
  try {
    await AsyncStorage.setItem(getDailyKey(dhikrText), count.toString());
  } catch (error) {
    console.error("Error saving daily count:", error);
  }
}

export async function incrementDailyCount(dhikrText: string): Promise<number> {
  const current = await getDailyCount(dhikrText);
  const newCount = current + 1;
  await setDailyCount(dhikrText, newCount);
  return newCount;
}

export async function decrementDailyCount(dhikrText: string): Promise<number> {
  const current = await getDailyCount(dhikrText);
  const newCount = Math.max(0, current - 1);
  await setDailyCount(dhikrText, newCount);
  return newCount;
}

export async function getGoal(dhikrText: string): Promise<number> {
  try {
    const stored = await AsyncStorage.getItem(getGoalKey(dhikrText));
    return stored ? parseInt(stored, 10) : 33;
  } catch {
    return 33;
  }
}

export async function setGoal(dhikrText: string, goal: number): Promise<void> {
  try {
    await AsyncStorage.setItem(getGoalKey(dhikrText), goal.toString());
  } catch (error) {
    console.error("Error saving goal:", error);
  }
}

export async function getHistory(dhikrText: string): Promise<DhikrHistory> {
  try {
    const stored = await AsyncStorage.getItem(getHistoryKey(dhikrText));
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    console.error("Error getting history");
  }
  return { totalCount: 0, dailyStats: [] };
}

export async function addToHistory(dhikrText: string, count: number): Promise<void> {
  try {
    const history = await getHistory(dhikrText);
    const today = getTodayDateString();
    
    const existingIndex = history.dailyStats.findIndex(s => s.date === today);
    if (existingIndex >= 0) {
      history.dailyStats[existingIndex].count = count;
    } else {
      history.dailyStats.push({ date: today, count });
      if (history.dailyStats.length > 30) {
        history.dailyStats = history.dailyStats.slice(-30);
      }
    }
    
    history.totalCount = history.dailyStats.reduce((sum, s) => sum + s.count, 0);
    await AsyncStorage.setItem(getHistoryKey(dhikrText), JSON.stringify(history));
  } catch (error) {
    console.error("Error saving history:", error);
  }
}

export async function resetDailyCount(dhikrText: string): Promise<void> {
  try {
    await AsyncStorage.setItem(getDailyKey(dhikrText), "0");
  } catch (error) {
    console.error("Error resetting daily count:", error);
  }
}
