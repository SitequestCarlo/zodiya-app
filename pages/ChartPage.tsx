import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ThreeScene from '../components/ThreeScene';
import { calculateNatalPositions } from '../utils/natalCalculator';

interface PageProps {
  title: string;
}

interface NatalSummary {
  sunSign: string;
  moonSign: string;
  ascendant: string;
  latitude: number;
  longitude: number;
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

function parseBirthDate(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour = 0, minute = 0] = timeStr.split(':').map(Number);

  if ([year, month, day, hour, minute].some((value) => Number.isNaN(value))) {
    throw new Error('Bitte verwende das Format YYYY-MM-DD und HH:MM.');
  }

  return new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1, hour, minute));
}

export default function ChartPage({ title }: PageProps) {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [summary, setSummary] = useState<NatalSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedCoordinates = useMemo(() => {
    if (!summary) {
      return null;
    }
    return `${summary.latitude.toFixed(2)}°, ${summary.longitude.toFixed(2)}°`;
  }, [summary]);

  const handleCalculate = useCallback(async () => {
    if (!birthDate || !birthTime || !birthPlace) {
      setError('Bitte fülle alle Felder aus.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const eventDate = parseBirthDate(birthDate.trim(), birthTime.trim());

      const geocodeHeaders: Record<string, string> | undefined =
        Platform.OS === 'web' ? undefined : { 'User-Agent': 'zodiya-app/1.0 (astro lookup)' };

      const response = await fetch(
        `${NOMINATIM_BASE_URL}?format=json&limit=1&q=${encodeURIComponent(birthPlace.trim())}`,
        { headers: geocodeHeaders },
      );

      if (!response.ok) {
        throw new Error('Geokodierung fehlgeschlagen.');
      }

      const geoData = await response.json();
      if (!Array.isArray(geoData) || geoData.length === 0) {
        throw new Error('Geburtsort wurde nicht gefunden.');
      }

      const latitude = parseFloat(geoData[0].lat);
      const longitude = parseFloat(geoData[0].lon);

      const positions = calculateNatalPositions(eventDate, latitude, longitude);

      setSummary({
        sunSign: positions.sunSign,
        moonSign: positions.moonSign,
        ascendant: positions.ascendant,
        latitude,
        longitude,
      });
    } catch (calcError) {
      const message = calcError instanceof Error ? calcError.message : 'Unbekannter Fehler.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [birthDate, birthTime, birthPlace]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>{title}</Text>

        <View style={styles.formCard}>
          <Text style={styles.formLabel}>Geburtsdatum</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#777"
            value={birthDate}
            onChangeText={setBirthDate}
            keyboardType="numbers-and-punctuation"
          />

          <Text style={styles.formLabel}>Geburtszeit</Text>
          <TextInput
            style={styles.input}
            placeholder="HH:MM (24h)"
            placeholderTextColor="#777"
            value={birthTime}
            onChangeText={setBirthTime}
            keyboardType="numbers-and-punctuation"
          />

          <Text style={styles.formLabel}>Geburtsort</Text>
          <TextInput
            style={styles.input}
            placeholder="Stadt, Land"
            placeholderTextColor="#777"
            value={birthPlace}
            onChangeText={setBirthPlace}
            autoCapitalize="words"
          />

          <TouchableOpacity style={styles.button} onPress={handleCalculate} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#0A0A0A" /> : <Text style={styles.buttonText}>Chart berechnen</Text>}
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {summary && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Dein Radix</Text>
              <Text style={styles.resultRow}>
                Sonnenzeichen: <Text style={styles.resultValue}>{summary.sunSign}</Text>
              </Text>
              <Text style={styles.resultRow}>
                Mondzeichen: <Text style={styles.resultValue}>{summary.moonSign}</Text>
              </Text>
              <Text style={styles.resultRow}>
                Szendent: <Text style={styles.resultValue}>{summary.ascendant}</Text>
              </Text>
              {formattedCoordinates && (
                <Text style={styles.coordinates}>Koordinaten: {formattedCoordinates}</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.sceneContainer}>
          <ThreeScene />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
    paddingHorizontal: 20,
  },
  heading: {
    fontFamily: 'Lancelot_400Regular',
    fontSize: 32,
    color: '#D4AF37',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  formCard: {
    backgroundColor: 'rgba(12, 12, 20, 0.7)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  formLabel: {
    color: '#D4AF37',
    fontFamily: 'CinzelDecorative_400Regular',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#D4AF37',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#0A0A0A',
    fontFamily: 'CinzelDecorative_700Bold',
    fontSize: 18,
  },
  errorText: {
    marginTop: 16,
    color: '#ff7b7b',
    fontFamily: 'CinzelDecorative_400Regular',
  },
  resultCard: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(10, 10, 10, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  resultTitle: {
    color: '#fff',
    fontFamily: 'CinzelDecorative_700Bold',
    fontSize: 20,
    marginBottom: 12,
  },
  resultRow: {
    color: '#fff',
    fontFamily: 'CinzelDecorative_400Regular',
    marginBottom: 6,
  },
  resultValue: {
    color: '#D4AF37',
    fontFamily: 'CinzelDecorative_700Bold',
  },
  coordinates: {
    marginTop: 8,
    color: '#aaa',
    fontFamily: 'CinzelDecorative_400Regular',
    fontSize: 14,
  },
  sceneContainer: {
    flex: 1,
    marginTop: 40,
    minHeight: 400,
  },
});
