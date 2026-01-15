import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Accelerometer } from 'expo-sensors';
import AstrologySvg from '../components/AstrologySvg';
import type { StoredUserData } from '../utils/storage';

const horoscopeQuotes = [
  "Die Sterne stehen heute zu deinen Gunsten",
  "Eine geheimnisvolle Gelegenheit erwartet dich",
  "Vertraue deiner Intuition, sie leitet dich gut",
  "Veränderung kommt, nimm sie an",
  "Deine Kreativität wird hell erstrahlen",
  "Die Liebe findet dich, wenn du es am wenigsten erwartest",
  "Das Glück begünstigt heute die Mutigen",
  "Eine Reise der Entdeckung beginnt bald",
  "Deine Geduld wird belohnt werden",
  "Das Universum verschwört sich zu deinen Gunsten",
  "Verborgene Talente werden bald zum Vorschein kommen",
  "Eine neue Freundschaft bringt Freude",
  "Finanzieller Wohlstand ist nahe",
  "Deine Träume enthalten wichtige Botschaften",
  "Das Abenteuer ruft, folge ihm",
  "Innerer Frieden ist in Reichweite",
  "Eine Herausforderung wird zum Segen",
  "Weisheit kommt aus unerwarteten Quellen",
  "Deine Freundlichkeit erzeugt Wellen",
  "Der Mond erleuchtet deinen Weg"
];

interface PageProps {
  title: string;
  userData?: StoredUserData;
  onResetData?: () => void;
}

export default function SpherePage({ title }: PageProps) {
  const insets = useSafeAreaInsets();
  const [currentQuote, setCurrentQuote] = useState("Schüttle dein Gerät\nfür dein Schicksal");
  const [isShaking, setIsShaking] = useState(false);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * horoscopeQuotes.length);
    setCurrentQuote(horoscopeQuotes[randomIndex]);
  };

  useEffect(() => {
    let subscription: any;

    if (Platform.OS !== 'web') {
      // Set up shake detection for mobile
      Accelerometer.setUpdateInterval(100);
      
      subscription = Accelerometer.addListener(accelerometerData => {
        const { x, y, z } = accelerometerData;
        const acceleration = Math.sqrt(x * x + y * y + z * z);
        
        // Detect shake (acceleration threshold)
        if (acceleration > 2.5 && !isShaking) {
          setIsShaking(true);
          getRandomQuote();
          
          // Prevent rapid consecutive shakes
          setTimeout(() => {
            setIsShaking(false);
          }, 1000);
        }
      });
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isShaking]);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20), paddingBottom: insets.bottom + 90 }]}>
      <Text style={styles.heading}>{title}</Text>
      <View style={styles.svgWrapper}>
        <TouchableOpacity 
          onPress={getRandomQuote}
          activeOpacity={0.7}
        >
          <AstrologySvg width={320} height={280}>
            <Text style={styles.centerText}>{currentQuote}</Text>
          </AstrologySvg>
        </TouchableOpacity>
      </View>
      {Platform.OS === 'web' && (
        <Text style={styles.instruction}>Klicke auf die Kristallkugel</Text>
      )}
      {Platform.OS !== 'web' && (
        <Text style={styles.instruction}>Schüttle dein Gerät</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  heading: {
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'Lancelot_400Regular',
    }),
    fontSize: 32,
    color: '#000',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  svgWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'Lancelot_400Regular',
    }),
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    lineHeight: 24,
  },
  instruction: {
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'Lancelot_400Regular',
    }),
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});
