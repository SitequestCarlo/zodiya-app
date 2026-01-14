import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserData } from '../pages/OnboardingPage';

const USER_DATA_KEY = '@zodiya_user_data';

export interface StoredUserData extends UserData {
  onboardingCompleted: boolean;
}

export const saveUserData = async (userData: UserData): Promise<void> => {
  try {
    const dataToStore: StoredUserData = {
      ...userData,
      onboardingCompleted: true,
    };
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(dataToStore));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

export const getUserData = async (): Promise<StoredUserData | null> => {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    if (data !== null) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
};

export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Error clearing user data:', error);
    throw error;
  }
};

export const hasCompletedOnboarding = async (): Promise<boolean> => {
  try {
    const userData = await getUserData();
    return userData?.onboardingCompleted ?? false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};
