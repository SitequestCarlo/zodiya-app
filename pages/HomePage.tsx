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
import TarotIcon from '../components/icons/TarotIcon';
import { getUserData, StoredUserData, clearUserData } from '../utils/storage';
import { calculateNatalPositions } from '../utils/natalCalculator';
import type { NatalSummary } from '../components/chart';
import { DAYS, MONTHS, YEARS } from '../components/chart';
import { ZodiacIconMap } from '../components/chart/ZodiacIcons';

interface HomePageProps {
  title: string;
  userData: StoredUserData;
  onResetData?: () => void;
  onNavigate?: (tabId: number) => void;
}

const zodiacSigns = [
  'Widder', 'Stier', 'Zwillinge', 'Krebs', 'Löwe', 'Jungfrau',
  'Waage', 'Skorpion', 'Schütze', 'Steinbock', 'Wassermann', 'Fische'
];

// Daily horoscope messages based on zodiac signs
const dailyHoroscopes: Record<string, string[]> = {
  'Aries': [
    'Heute ist ein Tag voller Energie und neuer Möglichkeiten. Nutze deine natürliche Führungskraft.',
    'Deine Initiative wird heute besonders geschätzt. Zeit, mutige Entscheidungen zu treffen.',
    'Eine unerwartete Gelegenheit könnte heute deinen Weg kreuzen. Sei bereit zu handeln.',
  ],
  'Taurus': [
    'Geduld und Beständigkeit bringen heute die besten Ergebnisse. Vertraue deinem Prozess.',
    'Konzentriere dich auf das, was dir wirklich wichtig ist. Qualität über Quantität.',
    'Deine praktische Herangehensweise hilft dir heute, wichtige Probleme zu lösen.',
  ],
  'Gemini': [
    'Kommunikation steht heute im Mittelpunkt. Deine Worte haben besondere Kraft.',
    'Deine Neugierde führt dich zu interessanten Entdeckungen. Bleib aufgeschlossen.',
    'Netzwerken und soziale Kontakte bringen heute positive Überraschungen.',
  ],
  'Cancer': [
    'Vertraue heute deinen Gefühlen. Deine Intuition weist dir den richtigen Weg.',
    'Familie und enge Beziehungen stehen im Fokus. Zeit für emotionale Verbindungen.',
    'Selbstfürsorge ist heute besonders wichtig. Höre auf die Bedürfnisse deines Herzens.',
  ],
  'Leo': [
    'Deine Kreativität und Ausstrahlung sind heute besonders stark. Zeig dich der Welt.',
    'Selbstvertrauen ist dein größter Trumpf heute. Stehe zu dem, was du bist.',
    'Eine Chance, im Rampenlicht zu stehen, könnte sich heute ergeben.',
  ],
  'Virgo': [
    'Dein Auge fürs Detail macht heute den Unterschied. Präzision zahlt sich aus.',
    'Organisation und Struktur helfen dir, deine Ziele zu erreichen. Bleib fokussiert.',
    'Deine praktische Intelligenz löst heute komplexe Probleme mit Leichtigkeit.',
  ],
  'Libra': [
    'Harmonie und Balance stehen heute im Vordergrund. Suche den Ausgleich.',
    'Deine diplomatischen Fähigkeiten sind heute besonders gefragt. Du bringst Menschen zusammen.',
    'Ästhetik und Schönheit inspirieren dich heute. Umgib dich mit dem, was dir gefällt.',
  ],
  'Scorpio': [
    'Deine Intensität und Leidenschaft führen heute zu tiefen Einsichten.',
    'Transformation ist möglich. Lass los, was dir nicht mehr dient.',
    'Vertraue deiner inneren Stärke. Du bist mächtiger, als du denkst.',
  ],
  'Sagittarius': [
    'Abenteuer ruft heute. Erweitere deinen Horizont und wage Neues.',
    'Optimismus und Zuversicht öffnen dir heute viele Türen.',
    'Deine philosophische Natur hilft dir, größere Zusammenhänge zu erkennen.',
  ],
  'Capricorn': [
    'Ausdauer und Disziplin bringen dich heute deinen Zielen näher.',
    'Deine Verantwortungsbewusstsein wird geschätzt. Führe mit gutem Beispiel.',
    'Langfristige Planung zahlt sich aus. Denke strategisch.',
  ],
  'Aquarius': [
    'Innovation und Originalität sind heute deine Stärken. Denk anders.',
    'Gemeinschaft und Zusammenarbeit bringen unerwartete Vorteile.',
    'Deine Vision für die Zukunft inspiriert andere. Teile deine Ideen.',
  ],
  'Pisces': [
    'Intuition und Mitgefühl leiten dich heute sicher durch den Tag.',
    'Deine kreative und spirituelle Seite sucht Ausdruck. Lass sie fließen.',
    'Empathie verbindet dich heute tief mit anderen. Sei der Heiler, der du bist.',
  ],
};

// Daily do's and don'ts
const dailyDosAndDonts: Record<string, { dos: string[], donts: string[] }> = {
  'Aries': {
    dos: ['Neue Projekte starten', 'Sport treiben', 'Führung übernehmen'],
    donts: ['Impulsive Entscheidungen', 'Andere überrennen', 'Ungeduld zeigen'],
  },
  'Taurus': {
    dos: ['Gemütlichkeit genießen', 'Finanzen planen', 'Sinne verwöhnen'],
    donts: ['Sturheit', 'Veränderungen blockieren', 'Materialismus'],
  },
  'Gemini': {
    dos: ['Kommunizieren', 'Lernen', 'Netzwerken'],
    donts: ['Oberflächlichkeit', 'Zu viel reden', 'Entscheidungen vermeiden'],
  },
  'Cancer': {
    dos: ['Familie pflegen', 'Gefühle ausdrücken', 'Intuition folgen'],
    donts: ['Sich zurückziehen', 'Überfürsorglichkeit', 'In der Vergangenheit leben'],
  },
  'Leo': {
    dos: ['Kreativ sein', 'Großzügigkeit zeigen', 'Im Mittelpunkt stehen'],
    donts: ['Arroganz', 'Dominanz', 'Aufmerksamkeit erzwingen'],
  },
  'Virgo': {
    dos: ['Organisieren', 'Helfen', 'Details beachten'],
    donts: ['Perfektionismus', 'Überkritik', 'Sich sorgen'],
  },
  'Libra': {
    dos: ['Harmonie schaffen', 'Schönheit genießen', 'Diplomatie üben'],
    donts: ['Unentschlossenheit', 'Konflikt vermeiden', 'Abhängigkeit'],
  },
  'Scorpio': {
    dos: ['Tief gehen', 'Transformieren', 'Authentisch sein'],
    donts: ['Misstrauen', 'Manipulation', 'Kontrollzwang'],
  },
  'Sagittarius': {
    dos: ['Abenteuer suchen', 'Lernen', 'Optimistisch bleiben'],
    donts: ['Übertreibung', 'Verantwortungslosigkeit', 'Taktlosigkeit'],
  },
  'Capricorn': {
    dos: ['Ziele verfolgen', 'Verantwortung übernehmen', 'Planen'],
    donts: ['Pessimismus', 'Kälte', 'Workaholismus'],
  },
  'Aquarius': {
    dos: ['Innovation fördern', 'Unabhängig sein', 'Gemeinschaft dienen'],
    donts: ['Distanziertheit', 'Starrköpfigkeit', 'Rebellion um ihrer selbst willen'],
  },
  'Pisces': {
    dos: ['Träumen', 'Mitgefühl zeigen', 'Kreativ sein'],
    donts: ['Realitätsflucht', 'Opferrolle', 'Grenzenlosigkeit'],
  },
};

export default function HomePage({ title, userData, onResetData, onNavigate }: HomePageProps) {
  const insets = useSafeAreaInsets();
  const [natalData, setNatalData] = useState<NatalSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    calculateChart();
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
        { paddingTop: Math.max(insets.top, 40), paddingBottom: insets.bottom + 90 }
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {getGreeting()}, {userData.name}
        </Text>
        <Text style={styles.date}>{getDateString()}</Text>
      </View>

      {natalData && (
        <>
          {/* Natal Chart Summary */}
          <View style={styles.zodiacColumn}>
            <TouchableOpacity 
              style={styles.zodiacCard}
              onPress={() => onNavigate && onNavigate(1)}
              activeOpacity={0.7}
            >
              <View style={styles.zodiacCardContent}>
                {ZodiacIconMap[natalData.sunSign] && 
                  React.createElement(ZodiacIconMap[natalData.sunSign], { size: 36, color: '#000' })
                }
                <View style={styles.zodiacTextContainer}>
                  <Text style={styles.signLabel}>Sonnenzeichen</Text>
                  <Text style={styles.signValue}>{natalData.sunSign}</Text>
                  <Text style={styles.signValueGerman}>{getGermanZodiacName(natalData.sunSign)}</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.zodiacCard}
              onPress={() => onNavigate && onNavigate(1)}
              activeOpacity={0.7}
            >
              <View style={styles.zodiacCardContent}>
                {ZodiacIconMap[natalData.moonSign] && 
                  React.createElement(ZodiacIconMap[natalData.moonSign], { size: 36, color: '#000' })
                }
                <View style={styles.zodiacTextContainer}>
                  <Text style={styles.signLabel}>Mondzeichen</Text>
                  <Text style={styles.signValue}>{natalData.moonSign}</Text>
                  <Text style={styles.signValueGerman}>{getGermanZodiacName(natalData.moonSign)}</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.zodiacCard}
              onPress={() => onNavigate && onNavigate(1)}
              activeOpacity={0.7}
            >
              <View style={styles.zodiacCardContent}>
                {ZodiacIconMap[natalData.ascendant] && 
                  React.createElement(ZodiacIconMap[natalData.ascendant], { size: 36, color: '#000' })
                }
                <View style={styles.zodiacTextContainer}>
                  <Text style={styles.signLabel}>Aszendent</Text>
                  <Text style={styles.signValue}>{natalData.ascendant}</Text>
                  <Text style={styles.signValueGerman}>{getGermanZodiacName(natalData.ascendant)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

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

          {/* Tarot Button */}
          <TouchableOpacity 
            style={styles.tarotButton}
            onPress={() => onNavigate && onNavigate(4)}
            activeOpacity={0.8}
          >
            <View style={styles.tarotButtonContent}>
              <TarotIcon color="#fff" width={16} height={22} />
              <Text style={styles.tarotButtonText}>Ziehe eine Tarot-Karte</Text>
            </View>
          </TouchableOpacity>
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
    backgroundColor: '#f9f9f9',
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
    color: '#000',
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
    color: '#666',
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
});
