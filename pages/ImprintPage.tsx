import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StoredUserData } from '../utils/storage';

interface PageProps {
  title: string;
  userData?: StoredUserData;
  onResetData?: () => void;
}

export default function ImprintPage({ title }: PageProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top, 40), paddingBottom: insets.bottom + 90 }
      ]}
    >
      <Text style={styles.heading}>Impressum</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Angaben gemäß § 5 TMG</Text>
        <Text style={styles.text}>
          Hochschule Karlsruhe – Technik und Wirtschaft{'\n'}
          Moltkestraße 30{'\n'}
          76133 Karlsruhe{'\n'}
          Deutschland
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projekt im Rahmen des Studiums</Text>
        <Text style={styles.text}>
          Diese App ist ein studentisches Projekt und dient ausschließlich{'\n'}
          zu Lehr- und Forschungszwecken.{'\n'}
          {'\n'}
          Projektbetreuung: Prof. Martin Schober
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kontakt</Text>
        <Text style={styles.text}>
          Hochschule Karlsruhe{'\n'}
          E-Mail: info@h-ka.de
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Haftungsausschluss</Text>
        <Text style={styles.text}>
          Die Inhalte dieser App wurden mit größter Sorgfalt erstellt. 
          Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte 
          können wir jedoch keine Gewähr übernehmen. Die App dient 
          ausschließlich Bildungszwecken und stellt keine professionelle 
          Beratung dar.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datenschutz</Text>
        <Text style={styles.text}>
          Diese App speichert Ihre eingegebenen Daten ausschließlich lokal 
          auf Ihrem Gerät. Es werden keine Daten an externe Server übertragen 
          oder mit Dritten geteilt.
        </Text>
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
  heading: {
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'Lancelot_400Regular',
    }),
    fontSize: 32,
    color: '#000',
    marginBottom: 30,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
});
