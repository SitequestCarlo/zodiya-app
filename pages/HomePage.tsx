import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TarotIcon from '../components/icons/TarotIcon';
import { getUserData, StoredUserData, clearUserData } from '../utils/storage';
import { calculateNatalPositions } from '../utils/natalCalculator';
import type { NatalSummary } from '../components/chart';
import { DAYS, MONTHS, YEARS } from '../components/chart';
import { ZodiacIconMap } from '../components/chart/ZodiacIcons';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisitDate: string;
  totalVisits: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

interface HomePageProps {
  title: string;
  userData: StoredUserData;
  onResetData?: () => void;
  onNavigate?: (tabId: number) => void;
}


// Universal daily horoscope messages - work for all signs but selection is influenced by sign
const universalHoroscopes: string[] = [
  'Heute ist ein Tag voller Möglichkeiten. Vertraue deiner inneren Stimme.',
  'Deine Intuition weist dir den richtigen Weg. Höre genau hin.',
  'Eine unerwartete Begegnung könnte heute neue Perspektiven eröffnen.',
  'Konzentriere dich auf das, was dir wirklich wichtig ist. Qualität zählt.',
  'Kreativität und Selbstausdruck stehen heute im Vordergrund.',
  'Geduld und Beständigkeit bringen die besten Ergebnisse.',
  'Kommunikation ist der Schlüssel. Deine Worte haben besondere Kraft.',
  'Harmonie und Balance helfen dir, Herausforderungen zu meistern.',
  'Vertraue deiner inneren Stärke. Du bist fähiger, als du denkst.',
  'Neue Ideen und frische Energie begleiten dich durch den Tag.',
  'Achte auf die kleinen Details. Sie machen heute den Unterschied.',
  'Beziehungen und Verbindungen stehen im Fokus. Pflege sie achtsam.',
  'Deine natürliche Weisheit führt dich zu wichtigen Erkenntnissen.',
  'Transformation ist möglich. Sei offen für Veränderung.',
  'Optimismus und Zuversicht öffnen dir viele Türen.',
  'Praktische Lösungen liegen näher, als du denkst.',
  'Deine Empathie und dein Mitgefühl sind heute besonders wertvoll.',
  'Selbstfürsorge ist kein Luxus, sondern eine Notwendigkeit.',
  'Mut und Entschlossenheit bringen dich deinen Zielen näher.',
  'Inspiration kommt von unerwarteten Orten. Bleib aufmerksam.',
  'Vertraue dem Prozess. Alles entwickelt sich zu seiner Zeit.',
  'Deine authentische Selbst verdient es, gesehen zu werden.',
  'Grenzen setzen ist ein Akt der Selbstliebe. Respektiere deine Bedürfnisse.',
  'Heute ist ein guter Tag, um alte Muster loszulassen.',
  'Deine Vision trägt die Kraft zur Verwirklichung in sich.',
  'Kleine Schritte führen zu großen Veränderungen.',
  'Vertraue darauf, dass du zur richtigen Zeit am richtigen Ort bist.',
  'Deine einzigartige Perspektive ist wertvoll. Teile sie.',
  'Balance zwischen Geben und Nehmen schafft inneren Frieden.',
  'Der gegenwärtige Moment birgt alle Möglichkeiten.',
];

// Universal do's and don'ts - selection influenced by zodiac sign
const universalDos: string[] = [
  'Achtsam kommunizieren',
  'Neue Perspektiven einnehmen',
  'Kreativ ausdrücken',
  'Grenzen respektieren',
  'Intuition vertrauen',
  'Selbstfürsorge praktizieren',
  'Authentisch sein',
  'Verbindungen pflegen',
  'Dankbarkeit kultivieren',
  'Bewegung einbauen',
  'Pausen einlegen',
  'Aktiv zuhören',
  'Kleinigkeiten schätzen',
  'Neues ausprobieren',
  'Hilfe annehmen',
  'Ziele visualisieren',
  'Im Moment bleiben',
  'Natur genießen',
];

const universalDonts: string[] = [
  'Überstürzte Entscheidungen',
  'Sich selbst kritisieren',
  'Andere vergleichen',
  'Negativität festhalten',
  'Grenzen ignorieren',
  'Sich überfordern',
  'Wichtiges aufschieben',
  'Isolation suchen',
  'Zweifel nachgeben',
  'Perfektionismus',
  'Kontrollzwang',
  'Sich verstellen',
  'Bedürfnisse unterdrücken',
  'Ungeduld zeigen',
  'Altes festhalten',
  'Sich ablenken',
  'Voreilige Urteile',
  'Energie verschwenden',
];

export default function HomePage({ title, userData, onResetData, onNavigate }: HomePageProps) {
  const insets = useSafeAreaInsets();
  const [natalData, setNatalData] = useState<NatalSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisitDate: '',
    totalVisits: 0,
  });
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'first_visit', title: 'Erste Schritte', description: 'Zodiya zum ersten Mal geöffnet', emoji: 'star', unlocked: false },
    { id: 'week_streak', title: 'Woche dabei', description: '7 Tage in Folge besucht', emoji: 'fire', unlocked: false, progress: 0, target: 7 },
    { id: 'month_streak', title: 'Mondmonat', description: '30 Tage in Folge besucht', emoji: 'moon', unlocked: false, progress: 0, target: 30 },
    { id: 'oracle_seeker', title: 'Orakel-Sucher', description: '10 Orakel-Weissagungen erhalten', emoji: 'crystal', unlocked: false, progress: 0, target: 10 },
    { id: 'tarot_reader', title: 'Tarot-Leser', description: '5 Tarot-Karten gezogen', emoji: 'card', unlocked: false, progress: 0, target: 5 },
    { id: 'crystal_collector', title: 'Kristall-Sammler', description: 'Alle Kristalle angesehen', emoji: 'gem', unlocked: false, progress: 0, target: 12 },
    { id: 'dedicated', title: 'Hingebungsvoll', description: '100 Tage insgesamt besucht', emoji: 'sparkle', unlocked: false, progress: 0, target: 100 },
  ]);

  const getAchievementIcon = (type: string): string => {
    switch (type) {
      case 'fire':
        return 'fire';
      case 'star':
        return 'star';
      case 'moon':
        return 'moon-waning-crescent';
      case 'crystal':
        return 'crystal-ball';
      case 'card':
        return 'cards';
      case 'gem':
        return 'diamond-stone';
      case 'sparkle':
        return 'shimmer';
      default:
        return 'star';
    }
  };

  const getAchievementNavigation = (achievementId: string): number | null => {
    switch (achievementId) {
      case 'oracle_seeker':
        return 3; // Sphere/Oracle page
      case 'tarot_reader':
        return 4; // Tarot page
      case 'crystal_collector':
        return 2; // Crystal page
      default:
        return null;
    }
  };

  const getGermanZodiacName = (englishName: string): string => {
    const zodiacMap: Record<string, string> = {
      'Aries': 'Widder',
      'Taurus': 'Stier',
      'Gemini': 'Zwillinge',
      'Cancer': 'Krebs',
      'Leo': 'Löwe',
      'Virgo': 'Jungfrau',
      'Libra': 'Waage',
      'Scorpio': 'Skorpion',
      'Sagittarius': 'Schütze',
      'Capricorn': 'Steinbock',
      'Aquarius': 'Wassermann',
      'Pisces': 'Fische',
    };
    return zodiacMap[englishName] || englishName;
  };

  const updateStreak = async () => {
    try {
      const storedData = await AsyncStorage.getItem('streakData');
      const today = new Date().toDateString();
      
      if (storedData) {
        const data: StreakData = JSON.parse(storedData);
    

  // Get a consistent selection based on sign and date
  const getSignBasedIndex = (sign: string, arrayLength: number, offset: number = 0): number => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const signIndex = signs.indexOf(sign);
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Create a pseudo-random but consistent index based on sign, day, and offset
    const hash = (signIndex * 37 + dayOfYear * 17 + offset * 13) % arrayLength;
    return hash;
  };

  const getDailyHoroscope = (sign: string): string => {
    const index = getSignBasedIndex(sign, universalHoroscopes.length);
    return universalHoroscopes[index];
  };

  const getDailyDos = (sign: string): string[] => {
    const indices = [
      getSignBasedIndex(sign, universalDos.length, 0),
      getSignBasedIndex(sign, universalDos.length, 1),
      getSignBasedIndex(sign, universalDos.length, 2),
    ];
    return indices.map(i => universalDos[i]);
  };

  const getDailyDonts = (sign: string): string[] => {
    const indices = [
      getSignBasedIndex(sign, universalDonts.length, 0),
      getSignBasedIndex(sign, universalDonts.length, 1),
      getSignBasedIndex(sign, universalDonts.length, 2),
    ];
    return indices.map(i => universalDonts[i]);
  };    const lastVisit = new Date(data.lastVisitDate);
        const daysDiff = Math.floor((new Date(today).getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));
        
        if (data.lastVisitDate === today) {
          // Same day, no change
          setStreakData(data);
        } else if (daysDiff === 1) {
          // Consecutive day
          const newStreak = data.currentStreak + 1;
          const updatedData = {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, data.longestStreak),
            lastVisitDate: today,
            totalVisits: data.totalVisits + 1,
          };
          await AsyncStorage.setItem('streakData', JSON.stringify(updatedData));
          setStreakData(updatedData);
          checkStreakAchievements(newStreak, updatedData.totalVisits);
        } else {
          // Streak broken
          const updatedData = {
            currentStreak: 1,
            longestStreak: data.longestStreak,
            lastVisitDate: today,
            totalVisits: data.totalVisits + 1,
          };
          await AsyncStorage.setItem('streakData', JSON.stringify(updatedData));
          setStreakData(updatedData);
        }
      } else {
        // First visit
        const initialData = {
          currentStreak: 1,
          longestStreak: 1,
          lastVisitDate: today,
          totalVisits: 1,
        };
        await AsyncStorage.setItem('streakData', JSON.stringify(initialData));
        setStreakData(initialData);
        unlockAchievement('first_visit');
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const loadAchievements = async () => {
    try {
      const stored = await AsyncStorage.getItem('achievements');
      if (stored) {
        setAchievements(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const unlockAchievement = async (achievementId: string) => {
    setAchievements(prev => {
      const updated = prev.map(achievement => 
        achievement.id === achievementId 
          ? { ...achievement, unlocked: true }
          : achievement
      );
      AsyncStorage.setItem('achievements', JSON.stringify(updated));
      return updated;
    });
  };

  const updateAchievementProgress = async (achievementId: string, progress: number) => {
    setAchievements(prev => {
      const updated = prev.map(achievement => {
        if (achievement.id === achievementId) {
          const newProgress = progress;
          const unlocked = achievement.target ? newProgress >= achievement.target : achievement.unlocked;
          return { ...achievement, progress: newProgress, unlocked };
        }
        return achievement;
      });
      AsyncStorage.setItem('achievements', JSON.stringify(updated));
      return updated;
    });
  };

  const checkStreakAchievements = (streak: number, totalVisits: number) => {
    if (streak >= 7) unlockAchievement('week_streak');
    if (streak >= 30) unlockAchievement('month_streak');
    if (totalVisits >= 100) unlockAchievement('dedicated');
    
    updateAchievementProgress('week_streak', streak);
    updateAchievementProgress('month_streak', streak);
    updateAchievementProgress('dedicated', totalVisits);
  };

  const getNextStreakGoal = (currentStreak: number) => {
    const goals = [3, 7, 14, 30, 60, 100, 200, 365];
    return goals.find(goal => goal > currentStreak) || goals[goals.length - 1];
  };

  useEffect(() => {
    calculateChart();
    updateStreak();
    loadAchievements();
  }, []);

  const calculateChart = async () => {
    setIsLoading(true);
    try {
      const birthDate = new Date(
        parseInt(YEARS[userData.birthYear]),
        userData.birthMonth,
        parseInt(DAYS[userData.birthDay])
      );
      
      birthDate.setHours(userData.birthHour, userData.birthMinute, 0);

      const result = calculateNatalPositions(
        birthDate,
        userData.birthPlaceLatitude,
        userData.birthPlaceLongitude
      );

      const natalSummary: NatalSummary = {
        sunSign: result.sunSign,
        moonSign: result.moonSign,
        ascendant: result.ascendant,
        latitude: userData.birthPlaceLatitude,
        longitude: userData.birthPlaceLongitude,
      };

      setNatalData(natalSummary);
    } catch (error) {
      console.error('Error calculating natal chart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Howdy';
    return 'Guten Abend';
  };

  const getDateString = () => {
    const today = new Date();
    const dayName = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][today.getDay()];
    const day = today.getDate();
    const month = MONTHS[today.getMonth()];
    const year = today.getFullYear();
    return `${dayName}, ${day}. ${month} ${year}`;
  };

  const handleReset = async () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Möchtest du wirklich alle Daten löschen und von vorne beginnen?')) {
        await clearUserData();
        if (onResetData) {
          onResetData();
        }
      }
    } else {
      Alert.alert(
        'Daten zurücksetzen',
        'Möchtest du wirklich alle Daten löschen und von vorne beginnen?',
        [
          { text: 'Abbrechen', style: 'cancel' },
          {
            text: 'Zurücksetzen',
            style: 'destructive',
            onPress: async () => {
              await clearUserData();
              if (onResetData) {
                onResetData();
              }
            },
          },
        ]
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top + 20, 60), paddingBottom: insets.bottom + 90 }
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {getGreeting()}, {userData.name}
        </Text>
        <Text style={styles.date}>{getDateString()}</Text>
      </View>

      {natalData && (
        <TouchableOpacity 
          style={styles.zodiacCompact}
          onPress={() => onNavigate && onNavigate(1)}
          activeOpacity={0.7}
        >
          <View style={styles.zodiacItem}>
            {ZodiacIconMap[natalData.sunSign] && 
              React.createElement(ZodiacIconMap[natalData.sunSign], { size: 24, color: '#000' })}
            <View style={styles.zodiacInfo}>
              <Text style={styles.zodiacLabel}>Sonne</Text>
              <Text style={styles.zodiacValue} numberOfLines={1}>{getGermanZodiacName(natalData.sunSign)}</Text>
            </View>
          </View>
          <View style={styles.zodiacItem}>
            {ZodiacIconMap[natalData.moonSign] && 
              React.createElement(ZodiacIconMap[natalData.moonSign], { size: 24, color: '#000' })}
            <View style={styles.zodiacInfo}>
              <Text style={styles.zodiacLabel}>Mond</Text>
              <Text style={styles.zodiacValue} numberOfLines={1}>{getGermanZodiacName(natalData.moonSign)}</Text>
            </View>
          </View>
          <View style={styles.zodiacItem}>
            {ZodiacIconMap[natalData.ascendant] && 
              React.createElement(ZodiacIconMap[natalData.ascendant], { size: 24, color: '#000' })}
            <View style={styles.zodiacInfo}>
              <Text style={styles.zodiacLabel}>Aszendent</Text>
              <Text style={styles.zodiacValue} numberOfLines={1}>{getGermanZodiacName(natalData.ascendant)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Streak Card */}
      <View style={styles.streakCard}>
        <View style={styles.streakContent}>
          <View style={styles.streakTextRow}>
            <MaterialCommunityIcons name="fire" size={20} color="#000" />
            <TegetDailyHoroscope(natalData.sunSign)}
            </Text>
          </View>

          {/* Daily Do's and Don'ts */}
          <View style={styles.dosAndDontsContainer}>
            <View style={styles.dosColumn}>
              <Text style={styles.columnTitle}>Heute empfohlen</Text>
              {getDailyDos(natalData.sunSign).map((doItem, index) => (
                <Text key={index} style={styles.listItem}>• {doItem}</Text>
              ))}
            </View>
            <View style={styles.dontsColumn}>
              <Text style={styles.columnTitle}>Heute vermeiden</Text>
              {getDailyDonts(natalData.sunSign)
          />
        </View>
      </View>

      {natalData && (
        <>
          {/* Daily Message */}
          <View style={styles.messageCard}>
            <Text style={styles.cardTitle}>Deine Tagesbotschaft</Text>
            <Text style={styles.message}>
              {dailyHoroscopes[natalData.sunSign]?.[new Date().getDay() % dailyHoroscopes[natalData.sunSign].length] || 
               'Heute ist ein guter Tag, um achtsam zu sein und deinen Intuitionen zu folgen.'}
            </Text>
          </View>

          {/* Daily Do's and Don'ts */}
          <View style={styles.dosAndDontsContainer}>
            <View style={styles.dosColumn}>
              <Text style={styles.columnTitle}>Heute empfohlen</Text>
              {dailyDosAndDonts[natalData.sunSign]?.dos.map((doItem, index) => (
                <Text key={index} style={styles.listItem}>• {doItem}</Text>
              ))}
            </View>
            <View style={styles.dontsColumn}>
              <Text style={styles.columnTitle}>Heute vermeiden</Text>
              {dailyDosAndDonts[natalData.sunSign]?.donts.map((dontItem, index) => (
                <Text key={index} style={styles.listItem}>• {dontItem}</Text>
              ))}
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.achievementsSection}>
            <Text style={styles.sectionTitle}>Erfolge</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
              {achievements.map((achievement) => {
                const navTarget = getAchievementNavigation(achievement.id);
                const AchievementWrapper = navTarget ? TouchableOpacity : View;
                const wrapperProps = navTarget ? {
                  onPress: () => onNavigate && onNavigate(navTarget),
                  activeOpacity: 0.7,
                } : {};
                
                return (
                  <AchievementWrapper
                    key={achievement.id}
                    {...wrapperProps}
                    style={[
                      styles.achievementCard,
                      achievement.unlocked && styles.achievementUnlocked
                    ]}
                  >
                  <View style={[
                    styles.achievementIconContainer,
                    !achievement.unlocked && styles.achievementLocked
                  ]}>
                    <MaterialCommunityIcons 
                      name={getAchievementIcon(achievement.emoji)} 
                      size={36} 
                      color={achievement.unlocked ? '#000' : '#999'} 
                    />
                  </View>
                  <Text style={[
                    styles.achievementTitle,
                    !achievement.unlocked && styles.achievementTextLocked
                  ]}>
                    {achievement.title}
                  </Text>
                  {achievement.target && !achievement.unlocked && (
                    <Text style={styles.achievementProgress}>
                      {achievement.progress || 0}/{achievement.target}
                    </Text>
                  )}
                  </AchievementWrapper>
                );
              })}
            </ScrollView>
          </View>
        </>
      )}

      <View style={styles.footerLinks}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Daten löschen</Text>
        </TouchableOpacity>
        <Text style={styles.linkSeparator}>•</Text>
        <TouchableOpacity style={styles.resetButton} onPress={() => onNavigate && onNavigate(5)}>
          <Text style={styles.resetButtonText}>Impressum</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 30,
  },
  greeting: {
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'Lancelot_400Regular',
    }),
    fontSize: 32,
    color: '#000',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#666',
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, sans-serif',
      default: undefined,
    }),
  },
  zodiacCompact: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 8,
    marginBottom: 24,
    justifyContent: 'space-between',
    gap: 4,
  },
  zodiacItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  zodiacInfo: {
    flex: 1,
    minWidth: 0,
  },
  zodiacLabel: {
    fontSize: 10,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  zodiacValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    marginBottom: 48,
  },
  zodiacColumn: {
    gap: 10,
    marginBottom: 48,
  },
  zodiacCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 16,
  },
  zodiacCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  zodiacTextContainer: {
    flex: 1,
    gap: 2,
  },
  messageCard: {
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 24,
    marginBottom: 48,
  },
  cardTitle: {
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'Lancelot_400Regular',
    }),
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
    marginTop: -8,
  },
  signRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  signItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  signLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 0,
    textAlign: 'left',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  signValue: {
    fontSize: 17,
    color: '#000',
    fontWeight: '600',
    textAlign: 'left',
    marginTop: 0,
  },
  signValueGerman: {
    fontSize: 13,
    color: '#999',
    fontWeight: '400',
    textAlign: 'left',
    marginTop: 0,
  },
  message: {
    fontSize: 15,
    lineHeight: 24,
    color: '#fff',
  },
  listItem: {
    fontSize: 14,
    lineHeight: 24,
    color: '#666',
    marginBottom: 6,
  },
  dosAndDontsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 48,
  },
  dosColumn: {
    flex: 1,
  },
  dontsColumn: {
    flex: 1,
  },
  columnTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  tarotButton: {
    backgroundColor: '#000',
    borderRadius: 16,
    padding: 18,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  tarotButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tarotButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    gap: 8,
  },
  linkSeparator: {
    fontSize: 11,
    color: '#ccc',
  },
  resetButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resetButtonText: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  streakCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  streakContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  streakGoal: {
    fontSize: 13,
    color: '#999',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 4,
  },
  achievementsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'Lancelot_400Regular',
    }),
    fontSize: 20,
    color: '#000',
    marginBottom: 16,
  },
  achievementsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  achievementCard: {
    width: 120,
    height: 140,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  achievementUnlocked: {
    backgroundColor: '#f9f9f9',
    borderWidth: 2,
    borderColor: '#000',
    opacity: 1,
  },
  achievementIconContainer: {
    marginBottom: 12,
  },
  achievementLocked: {
    opacity: 0.3,
  },
  achievementTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  achievementTextLocked: {
    color: '#999',
  },
  achievementProgress: {
    fontSize: 11,
    color: '#666',
    marginTop: 6,
  },
});
