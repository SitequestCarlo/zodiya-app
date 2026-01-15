import AsyncStorage from '@react-native-async-storage/async-storage';

interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

export async function incrementAchievementProgress(achievementId: string): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem('achievements');
    if (!stored) return;

    const achievements: Achievement[] = JSON.parse(stored);
    const updated = achievements.map(achievement => {
      if (achievement.id === achievementId && achievement.target) {
        const newProgress = (achievement.progress || 0) + 1;
        const unlocked = newProgress >= achievement.target;
        return { ...achievement, progress: newProgress, unlocked };
      }
      return achievement;
    });

    await AsyncStorage.setItem('achievements', JSON.stringify(updated));
  } catch (error) {
    console.error('Error incrementing achievement progress:', error);
  }
}

export async function recordOracleReading(): Promise<void> {
  await incrementAchievementProgress('oracle_seeker');
}

export async function recordTarotReading(): Promise<void> {
  await incrementAchievementProgress('tarot_reader');
}

export async function recordCrystalView(): Promise<void> {
  await incrementAchievementProgress('crystal_collector');
}
