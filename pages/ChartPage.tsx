import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  DateStep,
  TimeStep,
  PlaceStep,
  ResultStep,
  DAYS,
  MONTHS,
  YEARS,
  HOURS,
  MINUTES,
} from '../components/chart';
import type { PlaceSuggestion, NatalSummary } from '../components/chart';
import { calculateNatalPositions } from '../utils/natalCalculator';

interface PageProps {
  title: string;
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

type FormStep = 'date' | 'time' | 'place' | 'result';

// 4-pointed star SVG path (square with inverted corners) - rotated 45deg
const StarIcon = ({ size = 16, color = '#000' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: [{ rotate: '45deg' }] }}>
    <Path
      d="M12 0 Q13 9 14 10 Q15 10 24 12 Q15 14 14 14 Q13 15 12 24 Q11 15 10 14 Q9 14 0 12 Q9 10 10 10 Q11 9 12 0 Z"
      fill={color}
    />
  </Svg>
);

// Animated step dot component
const StepDot = ({ isActive }: { isActive: boolean }) => {
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const opacityAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1 : 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: isActive ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive, scaleAnim, opacityAnim]);

  return (
    <View style={styles.stepDotContainer}>
      {/* Inactive dot (circle) */}
      <Animated.View
        style={[
          styles.stepDot,
          {
            opacity: opacityAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          },
        ]}
      />
      {/* Active star */}
      <Animated.View
        style={[
          styles.stepStarContainer,
          {
            opacity: opacityAnim,
            transform: [
              {
                scale: scaleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
              {
                rotate: scaleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '45deg'],
                }),
              },
            ],
          },
        ]}
      >
        <StarIcon size={16} color="#000" />
      </Animated.View>
    </View>
  );
};

export default function ChartPage({ title }: PageProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>('date');
  
  // Get current date and time for initial values
  const now = new Date();
  const currentDayIndex = now.getDate() - 1; // DAYS array is 0-indexed (01-31)
  const currentMonthIndex = now.getMonth(); // Already 0-indexed
  const currentYearIndex = YEARS.indexOf(String(now.getFullYear())); // Find index in YEARS array
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
  
  // Result state
  const [summary, setSummary] = useState<NatalSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedCoordinates = useMemo(() => {
    if (!summary) return null;
    return `${summary.latitude.toFixed(2)}°, ${summary.longitude.toFixed(2)}°`;
  }, [summary]);

  const formattedDate = useMemo(() => {
    return `${DAYS[selectedDay]}. ${MONTHS[selectedMonth]} ${YEARS[selectedYear]}`;
  }, [selectedDay, selectedMonth, selectedYear]);

  const formattedTime = useMemo(() => {
    return `${HOURS[selectedHour]}:${MINUTES[selectedMinute]} Uhr`;
  }, [selectedHour, selectedMinute]);

  // Search for places with debounce
  useEffect(() => {
    // Don't search if a place is already selected (user just picked from suggestions)
    if (selectedPlace) {
      return;
    }
    
    if (birthPlace.length < 3) {
      setPlaceSuggestions([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const geocodeHeaders: Record<string, string> | undefined =
          Platform.OS === 'web' ? undefined : { 'User-Agent': 'zodiya-app/1.0 (astro lookup)' };

        const response = await fetch(
          `${NOMINATIM_BASE_URL}?format=json&limit=5&q=${encodeURIComponent(birthPlace.trim())}`,
          { headers: geocodeHeaders },
        );

        if (response.ok) {
          const data = await response.json();
          setPlaceSuggestions(data);
        }
      } catch {
        // Silently fail on search errors
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [birthPlace, selectedPlace]);

  const handleSelectPlace = useCallback((place: PlaceSuggestion) => {
    setSelectedPlace(place);
    setBirthPlace(place.display_name);
    setPlaceSuggestions([]);
  }, []);

  const handleContinue = useCallback(async () => {
    setError(null);
    
    if (currentStep === 'date') {
      setCurrentStep('time');
    } else if (currentStep === 'time') {
      setCurrentStep('place');
    } else if (currentStep === 'place') {
      if (!selectedPlace) {
        setError('Bitte wähle einen Ort aus den Vorschlägen.');
        return;
      }
      
      setIsLoading(true);
      try {
        const year = parseInt(YEARS[selectedYear], 10);
        const month = selectedMonth;
        const day = parseInt(DAYS[selectedDay], 10);
        const hour = parseInt(HOURS[selectedHour], 10);
        const minute = parseInt(MINUTES[selectedMinute], 10);
        
        const eventDate = new Date(Date.UTC(year, month, day, hour, minute));
        const latitude = parseFloat(selectedPlace.lat);
        const longitude = parseFloat(selectedPlace.lon);
        
        const positions = calculateNatalPositions(eventDate, latitude, longitude);
        
        setSummary({
          sunSign: positions.sunSign,
          moonSign: positions.moonSign,
          ascendant: positions.ascendant,
          latitude,
          longitude,
        });
        
        setCurrentStep('result');
      } catch (calcError) {
        const message = calcError instanceof Error ? calcError.message : 'Unbekannter Fehler.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [currentStep, selectedPlace, selectedYear, selectedMonth, selectedDay, selectedHour, selectedMinute]);

  const handleBack = useCallback(() => {
    if (currentStep === 'time') setCurrentStep('date');
    else if (currentStep === 'place') setCurrentStep('time');
    else if (currentStep === 'result') setCurrentStep('place');
  }, [currentStep]);

  const handleStartOver = useCallback(() => {
    setCurrentStep('date');
    setSummary(null);
    setSelectedPlace(null);
    setBirthPlace('');
  }, []);

  const getStepTitle = () => {
    switch (currentStep) {
      case 'date': return 'Wann wurdest du geboren?';
      case 'time': return 'Um welche Uhrzeit?';
      case 'place': return 'Wo wurdest du geboren?';
      case 'result': return 'Dein Radix';
    }
  };

  const handlePlaceChange = useCallback((text: string) => {
    setBirthPlace(text);
    setSelectedPlace(null);
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Header section */}
        <View style={styles.headerSection}>
          {/* <Text style={styles.heading}>{title}</Text> */}
          
          {/* Step indicator - only show for input steps */}
          {currentStep !== 'result' && (
            <View style={styles.stepIndicator}>
              <StepDot isActive={currentStep === 'date'} />
              <View style={styles.stepLine} />
              <StepDot isActive={currentStep === 'time'} />
              <View style={styles.stepLine} />
              <StepDot isActive={currentStep === 'place'} />
            </View>
          )}
          
          <Text style={styles.stepTitle}>{getStepTitle()}</Text>
        </View>

        {/* Center content section */}
        <View style={styles.centerSection}>
          <View style={styles.formCard}>
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
                onPlaceChange={handlePlaceChange}
                onSelectPlace={handleSelectPlace}
              />
            )}
            {currentStep === 'result' && summary && (
              <ResultStep
                summary={summary}
                formattedDate={formattedDate}
                formattedTime={formattedTime}
                placeName={selectedPlace?.display_name.split(',')[0] || ''}
              />
            )}
            
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </View>

        {/* Bottom button section */}
        <View style={styles.bottomSection}>
          <View style={styles.buttonContainer}>
            {currentStep !== 'date' && currentStep !== 'result' && (
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>Zurück</Text>
              </TouchableOpacity>
            )}
            
            {currentStep !== 'result' ? (
              <TouchableOpacity
                style={[styles.continueButton, isLoading && styles.buttonDisabled]}
                onPress={handleContinue}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.continueButtonText}>
                    {currentStep === 'place' ? 'Berechnen' : 'Weiter'}
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.continueButton} onPress={handleStartOver}>
                <Text style={styles.continueButtonText}>Neu starten</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerSection: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 20,
  },
  heading: {
    fontFamily: 'Lancelot_400Regular',
    fontSize: 32,
    color: '#000',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stepDotContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  stepStarContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: {
    width: 30,
    height: 2,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  stepTitle: {
    fontFamily: 'CinzelDecorative_400Regular',
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  backButtonText: {
    fontFamily: 'CinzelDecorative_400Regular',
    fontSize: 16,
    color: '#000',
  },
  continueButton: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 50,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  continueButtonText: {
    fontFamily: 'CinzelDecorative_700Bold',
    fontSize: 16,
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorText: {
    marginTop: 16,
    color: '#c00',
    fontFamily: 'CinzelDecorative_400Regular',
    textAlign: 'center',
  },
});
