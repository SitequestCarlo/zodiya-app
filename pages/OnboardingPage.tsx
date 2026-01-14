import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DateStep,
  TimeStep,
  PlaceStep,
  DAYS,
  MONTHS,
  YEARS,
  HOURS,
  MINUTES,
} from '../components/chart';
import type { PlaceSuggestion } from '../components/chart';

interface OnboardingPageProps {
  onComplete: (userData: UserData) => void;
}

export interface UserData {
  name: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  birthHour: number;
  birthMinute: number;
  birthPlace: PlaceSuggestion;
  birthPlaceName: string;
  birthPlaceLatitude: number;
  birthPlaceLongitude: number;
}

type OnboardingStep = 'name' | 'date' | 'time' | 'place';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('name');
  const [name, setName] = useState('');
  
  // Get current date and time for initial values
  const now = new Date();
  const currentDayIndex = now.getDate() - 1;
  const currentMonthIndex = now.getMonth();
  const currentYearIndex = YEARS.indexOf(String(now.getFullYear()));
  const currentHourIndex = now.getHours();
  const currentMinuteIndex = now.getMinutes();
  
  // Date picker state
  const [selectedDay, setSelectedDay] = useState(currentDayIndex);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);
  const [selectedYear, setSelectedYear] = useState(currentYearIndex >= 0 ? currentYearIndex : 0);
  
  // Time picker state
  const [selectedHour, setSelectedHour] = useState(currentHourIndex);
  const [selectedMinute, setSelectedMinute] = useState(currentMinuteIndex);
  
  // Place state
  const [birthPlace, setBirthPlace] = useState('');
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceSuggestion | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  // Debounced place search
  useEffect(() => {
    if (birthPlace.length < 3) {
      setPlaceSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `${NOMINATIM_BASE_URL}?format=json&q=${encodeURIComponent(birthPlace)}&limit=5`
        );
        const data = await response.json();
        setPlaceSuggestions(data);
      } catch (error) {
        console.error('Error fetching places:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [birthPlace]);

  const handleNext = () => {
    if (currentStep === 'name' && name.trim()) {
      setCurrentStep('date');
    } else if (currentStep === 'date') {
      setCurrentStep('time');
    } else if (currentStep === 'time') {
      setCurrentStep('place');
    } else if (currentStep === 'place' && selectedPlace) {
      onComplete({
        name: name.trim(),
        birthDay: selectedDay,
        birthMonth: selectedMonth,
        birthYear: selectedYear,
        birthHour: selectedHour,
        birthMinute: selectedMinute,
        birthPlace: selectedPlace,
        birthPlaceName: selectedPlace.display_name,
        birthPlaceLatitude: parseFloat(selectedPlace.lat),
        birthPlaceLongitude: parseFloat(selectedPlace.lon),
      });
    }
  };

  const handleBack = () => {
    if (currentStep === 'date') {
      setCurrentStep('name');
    } else if (currentStep === 'time') {
      setCurrentStep('date');
    } else if (currentStep === 'place') {
      setCurrentStep('time');
    }
  };

  const canProceed = () => {
    if (currentStep === 'name') return name.trim().length > 0;
    if (currentStep === 'place') return selectedPlace !== null;
    return true;
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'name':
        return 'Willkommen bei Zodiya';
      case 'date':
        return 'Wann wurdest du geboren?';
      case 'time':
        return 'Um welche Uhrzeit?';
      case 'place':
        return 'Wo wurdest du geboren?';
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 'name':
        return 'Wie sollen wir dich nennen?';
      case 'date':
        return 'Wähle dein Geburtsdatum';
      case 'time':
        return 'Wähle deine Geburtszeit';
      case 'place':
        return 'Suche nach deinem Geburtsort';
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, 40), paddingBottom: Math.max(insets.bottom, 40) }
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <Text style={styles.title}>{getStepTitle()}</Text>
            <Text style={styles.subtitle}>{getStepSubtitle()}</Text>
          </View>

          <View style={styles.stepContent}>
            {currentStep === 'name' && (
              <View style={styles.nameInputContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Dein Name"
                  placeholderTextColor="#999"
                  autoFocus
                  returnKeyType="next"
                  onSubmitEditing={handleNext}
                />
              </View>
            )}

            {currentStep === 'date' && (
              <DateStep
                selectedDay={selectedDay}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onDayChange={setSelectedDay}
                onMonthChange={setSelectedMonth}
                onYearChange={setSelectedYear}
              />
            )}

            {currentStep === 'time' && (
              <TimeStep
                selectedHour={selectedHour}
                selectedMinute={selectedMinute}
                onHourChange={setSelectedHour}
                onMinuteChange={setSelectedMinute}
              />
            )}

            {currentStep === 'place' && (
              <PlaceStep
                birthPlace={birthPlace}
                placeSuggestions={placeSuggestions}
                selectedPlace={selectedPlace}
                isSearching={isSearching}
                onPlaceChange={setBirthPlace}
                onSelectPlace={setSelectedPlace}
              />
            )}
          </View>

          <View style={styles.buttonContainer}>
            {currentStep !== 'name' && (
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>Zurück</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.nextButton, !canProceed() && styles.buttonDisabled]}
              onPress={handleNext}
              disabled={!canProceed()}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === 'place' ? 'Fertig' : 'Weiter'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressIndicator}>
            {['name', 'date', 'time', 'place'].map((step, index) => (
              <View
                key={step}
                style={[
                  styles.progressDot,
                  step === currentStep && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'Lancelot_400Regular',
    }),
    fontSize: 32,
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, sans-serif',
      default: undefined,
    }),
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  stepContent: {
    minHeight: 300,
    justifyContent: 'center',
    marginBottom: 40,
  },
  nameInputContainer: {
    alignItems: 'center',
  },
  nameInput: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#000',
    fontSize: 16,
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'Lancelot_400Regular',
    }),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  backButtonText: {
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'Lancelot_400Regular',
    }),
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
  nextButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    backgroundColor: '#000',
  },
  nextButtonText: {
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'Lancelot_400Regular',
    }),
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  progressDotActive: {
    backgroundColor: '#000',
    width: 24,
  },
});
