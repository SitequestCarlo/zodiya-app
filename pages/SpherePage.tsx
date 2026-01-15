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
  // Weird & Esoteric
  "Mercury retrograde hat deine Socken versteckt, aber Saturn bringt sie zurück",
  "Die kosmische Pizza des Schicksals wird heute mit extra Käse geliefert",
  "Dein Schutzengel hat gerade Pause, aber dein Geist-Lama ist im Dienst",
  "Die Akasha-Chronik zeigt: Du wirst heute etwas Wichtiges vergessen, dann erinnern",
  "Jupiter flüstert: Kaufe die Bananen",
  "Dein drittes Auge blinzelt – vielleicht brauchst du eine Brille",
  "Die Portale zwischen den Dimensionen sind heute weit geöffnet... oder nur angelehnt",
  "Merkur sendet: LOL",
  "Ein interdimensionales Wesen möchte dich zu Tee einladen",
  "Deine Seele erinnert sich an ein Leben als mittelalterlicher Käsemacher",
  "Die Matrix glitcht heute – nutze es aus",
  "Neptun sagt, du sollst öfter mit Delfinen sprechen (Stofftiere zählen)",
  "Dein Karma-Konto hat ein Plus, aber die Zinsen sind merkwürdig",
  "Die Schleier zwischen den Welten sind dünn – trage einen Schal",
  "Pluto wurde degradiert, aber deine Probleme nicht",
  "Ein Wurmloch öffnet sich in deinem Kühlschrank",
  "Die Sternenwesen nicken zustimmend",
  "Heute ist ein guter Tag, um mit Kristallen zu flüstern",
  "Venus in Waage bedeutet: Wasch die Waage",
  "Die Numerologie deiner Telefonnummer enthüllt... nichts Besonderes",
  "Deine Aura hat heute einen netten Violett-Ton (oder ist das nur das Licht?)",
  "Die kosmische Energie sagt: Mach ein Nickerchen",
  "Saturn testet dich, aber du kannst spicken",
  "Ein Portal öffnet sich... es ist deine Haustür",
  "Die alten Götter haben dich auf stumm geschaltet",
  "Merkwürdige Schwingungen heute – oder ist die Waschmaschine kaputt?",
  "Die Kristallkugel braucht auch mal Urlaub",
  "Dein Seelenplan wurde vom Universum verschoben – technische Probleme",
  "Die Engel singen... aber sie kennen den Text nicht",
  "Achtung: Retrograde Vibes oder einfach nur Montag",
  "Das Universum sagt 'ja', aber mit Fragezeichen",
  "Deine Chakren sind durcheinander – wie Kopfhörer in der Tasche",
  "Die kosmische Ordnung empfiehlt: Pizza",
  "Heute regnet es Sternenstaub (oder normaler Regen, schwer zu sagen)",
  "Die Weisheit der Ahnen lautet: Vergiss nicht die Milch",
  "Ein Geist möchte dir folgen... auf Instagram",
  "Die Planeten sind aligned – oder sie versuchen es zumindest",
  "Dein Spirit Animal ist verwirrt, aber solidarisch",
  "Die Matrix hat dich gesehen – sie winkt zurück",
  "Quantenphysik sagt: Vielleicht, vielleicht auch nicht",
  "Der Kosmos sendet Memes",
  "Vorsicht: Mystische Kräfte könnten dein WLAN stören",
  "Die Geister der Vergangenheit sagen: brb",
  "Dein höheres Selbst hat eine wichtige Nachricht: ...",
  "Die universelle Weisheit lädt... 99%",
  "Astrale Projektion empfohlen – oder einfach mal rausgehen",
  "Die Sterne buchstabieren deinen Namen... fast",
  "Kosmische Ironie in 3, 2, 1...",
  "Das Schicksal kichert",
  "Die Zeit ist eine Illusion – Mittagessen doppelt",
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
      {currentQuote !== "Schüttle dein Gerät\nfür dein Schicksal" && (
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
          activeOpacity={0.6}
        >
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <Path 
              d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12549 15.0077 5.24919 15.0227 5.37063L8.08261 9.84971C7.54305 9.32831 6.8097 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15C6.8097 15 7.54305 14.6717 8.08261 14.1503L15.0227 18.6294C15.0077 18.7508 15 18.8745 15 19C15 20.6569 16.3431 22 18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C17.1903 16 16.457 16.3283 15.9174 16.8497L8.97733 12.3706C8.99229 12.2492 9 12.1255 9 12C9 11.8745 8.99229 11.7508 8.97733 11.6294L15.9174 7.15029C16.457 7.67169 17.1903 8 18 8Z" 
              fill="#000"
            />
          </Svg>
        </TouchableOpacity>
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
