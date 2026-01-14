import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ZodiacIconMap, ZodiacGermanNames, ZodiacDescriptions } from './ZodiacIcons';

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

interface ZodiacResultCardProps {
  label: string;
  sign: string;
}

const ZodiacResultCard = ({ label, sign }: ZodiacResultCardProps) => {
  const Icon = ZodiacIconMap[sign];
  const germanName = ZodiacGermanNames[sign] || sign;
  const description = ZodiacDescriptions[sign] || '';

  return (
    <View style={styles.zodiacCard}>
      <Text style={styles.zodiacLabel}>{label}</Text>
      <View style={styles.zodiacContent}>
        {Icon && <Icon size={40} color="#000" />}
        <View style={styles.zodiacNames}>
          <Text style={styles.germanName}>{germanName}</Text>
          <Text style={styles.latinName}>{sign}</Text>
        </View>
      </View>
      {description && (
        <Text style={styles.zodiacDescription}>„{description}"</Text>
      )}
    </View>
  );
};

export default function ResultStep({
  summary,
  formattedDate,
  formattedTime,
  placeName,
}: ResultStepProps) {
  const formattedCoordinates = `${summary.latitude.toFixed(2)}°, ${summary.longitude.toFixed(2)}°`;

  return (
    <ScrollView 
      style={styles.resultContainer} 
      contentContainerStyle={styles.resultContent}
      showsVerticalScrollIndicator={false}
    >
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
        <Text style={styles.resultRow}>
          <Text style={styles.resultLabel}>Koordinaten: </Text>
          <Text style={styles.resultValue}>{formattedCoordinates}</Text>
        </Text>
      </View>
      
      <ZodiacResultCard label="Sonnenzeichen" sign={summary.sunSign} />
      <ZodiacResultCard label="Mondzeichen" sign={summary.moonSign} />
      <ZodiacResultCard label="Aszendent" sign={summary.ascendant} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  resultContainer: {
    width: '100%',
  },
  resultContent: {
    paddingBottom: 0,
  },
  resultCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
    marginBottom: 12,
  },
  zodiacCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
    marginBottom: 12,
  },
  zodiacLabel: {
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      default: 'CinzelDecorative_400Regular',
    }),
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  zodiacContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  zodiacNames: {
    flexDirection: 'column',
  },
  germanName: {
    fontFamily: 'Lancelot_400Regular',
    fontSize: 14,
    color: '#666',
  },
  latinName: {
    fontFamily: 'Lancelot_400Regular',
    fontSize: 24,
    color: '#000',
  },
  zodiacDescription: {
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'CinzelDecorative_400Regular',
    }),
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    marginTop: 12,
    lineHeight: 22,
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
