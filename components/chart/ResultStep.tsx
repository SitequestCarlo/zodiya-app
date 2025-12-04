import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

export interface NatalSummary {
  sunSign: string;
  moonSign: string;
  ascendant: string;
  latitude: number;
  longitude: number;
}

interface ResultStepProps {
  summary: NatalSummary;
  formattedDate: string;
  formattedTime: string;
  placeName: string;
}

export default function ResultStep({
  summary,
  formattedDate,
  formattedTime,
  placeName,
}: ResultStepProps) {
  const formattedCoordinates = `${summary.latitude.toFixed(2)}°, ${summary.longitude.toFixed(2)}°`;

  return (
    <View style={styles.resultContainer}>
      <View style={styles.resultCard}>
        <Text style={styles.resultRow}>
          <Text style={styles.resultLabel}>Geburtsdatum: </Text>
          <Text style={styles.resultValue}>{formattedDate}</Text>
        </Text>
        <Text style={styles.resultRow}>
          <Text style={styles.resultLabel}>Geburtszeit: </Text>
          <Text style={styles.resultValue}>{formattedTime}</Text>
        </Text>
        <Text style={styles.resultRow}>
          <Text style={styles.resultLabel}>Geburtsort: </Text>
          <Text style={styles.resultValue}>{placeName}</Text>
        </Text>
      </View>
      
      <View style={styles.resultCard}>
        <Text style={styles.resultRow}>
          <Text style={styles.resultLabel}>Sonnenzeichen: </Text>
          <Text style={styles.resultValue}>{summary.sunSign}</Text>
        </Text>
        <Text style={styles.resultRow}>
          <Text style={styles.resultLabel}>Mondzeichen: </Text>
          <Text style={styles.resultValue}>{summary.moonSign}</Text>
        </Text>
        <Text style={styles.resultRow}>
          <Text style={styles.resultLabel}>Aszendent: </Text>
          <Text style={styles.resultValue}>{summary.ascendant}</Text>
        </Text>
        <Text style={styles.coordinates}>Koordinaten: {formattedCoordinates}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  resultContainer: {
    width: '100%',
  },
  resultCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 12,
  },
  resultLabel: {
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      default: 'CinzelDecorative_400Regular',
    }),
    color: '#666',
  },
  resultRow: {
    color: '#000',
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      default: 'CinzelDecorative_400Regular',
    }),
    marginBottom: 6,
  },
  resultValue: {
    color: '#000',
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      default: 'CinzelDecorative_700Bold',
    }),
    fontWeight: Platform.select({ web: '600', default: undefined }),
  },
  coordinates: {
    marginTop: 8,
    color: '#666',
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      default: 'CinzelDecorative_400Regular',
    }),
    fontSize: 14,
  },
});
