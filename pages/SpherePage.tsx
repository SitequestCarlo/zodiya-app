import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Animated, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import AstrologySvg from '../components/AstrologySvg';
import type { StoredUserData } from '../utils/storage';
import { recordOracleReading } from '../utils/achievementTracker';

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
  "Der Mond erleuchtet deinen Weg",
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
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * horoscopeQuotes.length);
    
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Fade out, change quote, fade in
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Pulse/scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Glow effect
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();
    
    // Shake animation
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
    
    setTimeout(() => {
      setCurrentQuote(horoscopeQuotes[randomIndex]);
      recordOracleReading();
    }, 200);
  };
  
  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(138, 43, 226, 0)', 'rgba(138, 43, 226, 0.4)'],
  });

  const getDynamicFontSize = () => {
    const length = currentQuote.length;
    if (length > 120) return 13;
    if (length > 90) return 14;
    if (length > 70) return 15;
    if (length > 50) return 16;
    return 18;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🔮 ${currentQuote}\n\n✨ Zodiya Oracle`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
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
          <Animated.View 
            style={[
              styles.animatedContainer,
              {
                transform: [
                  { scale: scaleAnim },
                  { translateX: shakeAnim },
                ],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.glowEffect,
                {
                  shadowColor: glowColor,
                  shadowOpacity: glowAnim,
                },
              ]}
            >
              <AstrologySvg width={320} height={280}>
                <Animated.Text 
                  style={[
                    styles.centerText,
                    { 
                      opacity: fadeAnim,
                      fontSize: getDynamicFontSize(),
                    },
                  ]}
                >
                  {currentQuote}
                </Animated.Text>
              </AstrologySvg>
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
      </View>
      {Platform.OS === 'web' && (
        <Text style={styles.instruction}>Klicke auf die Kristallkugel für mehr Weisheiten</Text>
      )}
      {Platform.OS !== 'web' && (
        <Text style={styles.instruction}>Schüttle dein Gerät für mehr Weisheiten</Text>
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
  animatedContainer: {
    alignItems: 'center',
  },
  glowEffect: {
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 30,
    elevation: 10,
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
  shareButton: {
    marginTop: 16,
    padding: 8,
    alignSelf: 'center',
  },
});
