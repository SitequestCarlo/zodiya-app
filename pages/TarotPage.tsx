import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TarotCardImage, TAROT_CARDS } from '../components/tarot/TarotSvgCards';
import TarotBackside from '../components/tarot/TarotBackside';
import type { StoredUserData } from '../utils/storage';
import { recordTarotReading } from '../utils/achievementTracker';

interface PageProps {
  title: string;
  userData?: StoredUserData;
  onResetData?: () => void;
}

const CARD_WIDTH = 140;
const CARD_HEIGHT = 219; // SVG aspect ratio 1050.7:1643.43 ≈ 1:1.564, with 5px padding: (130 * 1.564) + 10 = ~214
const PADDING = 5;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ReadingType = 'single' | 'three' | null;
type ReadingPhase = 'selection' | 'reveal';

interface DrawnCard {
  card: typeof TAROT_CARDS[0];
  position: 'past' | 'present' | 'future' | 'single';
  isFlipped: boolean;
}

// Single animated card component
const TarotCard = ({
  card,
  isFlipped,
  onFlip,
  label,
  index,
  showDescription = false,
  position,
}: {
  card: typeof TAROT_CARDS[0] | null;
  isFlipped: boolean;
  onFlip: () => void;
  label?: string;
  index: number;
  showDescription?: boolean;
  position?: 'past' | 'present' | 'future' | 'single';
}) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
      delay: index * 200,
    }).start();
  }, []);

  useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [isFlipped]);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['180deg', '90deg', '0deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const slideTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ translateY: slideTranslate }],
          opacity: slideAnim,
        },
      ]}
    >
      {label && <Text style={styles.cardLabel}>{label}</Text>}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onFlip}
        disabled={isFlipped}
      >
        <View style={styles.cardWrapper}>
          {/* Back of card (showing initially) */}
          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              {
                transform: [{ rotateY: frontInterpolate }],
                opacity: frontOpacity,
              },
            ]}
          >
            <TarotBackside
              width={CARD_WIDTH - PADDING * 2}
              height={CARD_HEIGHT - PADDING * 2}
            />
          </Animated.View>
          {/* Front of card (revealed) */}
          <Animated.View
            style={[
              styles.card,
              styles.cardFront,
              {
                transform: [{ rotateY: backInterpolate }],
                opacity: backOpacity,
              },
            ]}
          >
            {card && (
              <TarotCardImage
                cardFile={card.file}
                width={CARD_WIDTH - PADDING * 2}
                height={CARD_HEIGHT - PADDING * 2}
                color="black"
                backgroundColor="white"
              />
            )}
          </Animated.View>
        </View>
      </TouchableOpacity>
      {isFlipped && card && (
        <>
          <Text style={styles.cardName}>{card.name}</Text>
          {showDescription && (
            <Text style={styles.cardDescription}>
              {position === 'past' && card.pastDescription
                ? card.pastDescription
                : position === 'present' && card.presentDescription
                ? card.presentDescription
                : position === 'future' && card.futureDescription
                ? card.futureDescription
                : card.description}
            </Text>
          )}
        </>
      )}
    </Animated.View>
  );
};

export default function TarotPage({ title }: PageProps) {
  const [readingType, setReadingType] = useState<ReadingType>(null);
  const [phase, setPhase] = useState<ReadingPhase>('selection');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [deck, setDeck] = useState<typeof TAROT_CARDS>([]);
  const [readingId, setReadingId] = useState(0); // Unique ID for each reading session

  // Shuffle deck and return shuffled cards
  const getShuffledDeck = useCallback(() => {
    return [...TAROT_CARDS].sort(() => Math.random() - 0.5);
  }, []);

  // Start a reading - immediately draw all cards
  const startReading = useCallback((type: ReadingType) => {
    const shuffled = getShuffledDeck();
    
    const positions: Array<'past' | 'present' | 'future' | 'single'> =
      type === 'single'
        ? ['single']
        : ['past', 'present', 'future'];
    
    const cards: DrawnCard[] = positions.map((position, index) => ({
      card: shuffled[index],
      position,
      isFlipped: false,
    }));
    
    setReadingType(type);
    setDrawnCards(cards);
    setDeck(shuffled.slice(positions.length));
    setPhase('reveal');
    setReadingId((prev) => prev + 1); // Increment reading ID for fresh components
  }, [getShuffledDeck]);

  // Flip a card
  const flipCard = useCallback((index: number) => {
    setDrawnCards((prev) =>
      prev.map((c, i) =>
        i === index ? { ...c, isFlipped: true } : c
      )
    );
    recordTarotReading();
  }, []);

  // Reset reading
  const resetReading = useCallback(() => {
    setReadingType(null);
    setPhase('selection');
    setDrawnCards([]);
    setDeck([]);
  }, []);

  // Get label for position
  const getPositionLabel = (position: DrawnCard['position']) => {
    switch (position) {
      case 'past':
        return 'Vergangenheit';
      case 'present':
        return 'Gegenwart';
      case 'future':
        return 'Zukunft';
      default:
        return 'Deine Karte';
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <ScrollView
        key={`scroll-${phase}-${readingId}`}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {phase === 'selection' && (
          <View style={styles.selectionContainer}>
            <Text style={styles.subtitle}>Wähle deine Legung</Text>
            <TouchableOpacity
              style={styles.readingButton}
              onPress={() => startReading('single')}
            >
              <Text style={styles.readingButtonTitle}>Tageskarte</Text>
              <Text style={styles.readingButtonDesc}>
                Ziehe eine Karte für den Tag
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.readingButton}
              onPress={() => startReading('three')}
            >
              <Text style={styles.readingButtonTitle}>Drei-Karten-Legung</Text>
              <Text style={styles.readingButtonDesc}>
                Vergangenheit • Gegenwart • Zukunft
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'reveal' && (
          <View style={styles.revealContainer}>
            <Text style={styles.subtitle}>
              {readingType === 'single'
                ? 'Tippe, um deine Karte aufzudecken'
                : 'Tippe auf jede Karte zum Aufdecken'}
            </Text>
            <View
              style={[
                styles.cardsRow,
                readingType === 'single' && styles.singleCardRow,
              ]}
            >
              {drawnCards.map((drawn, index) => (
                <TarotCard
                  key={`${readingId}-${drawn.card.id}-${index}`}
                  card={drawn.card}
                  isFlipped={drawn.isFlipped}
                  onFlip={() => flipCard(index)}
                  label={getPositionLabel(drawn.position)}
                  index={index}
                  showDescription={true}
                  position={drawn.position}
                />
              ))}
            </View>
            {drawnCards.every((c) => c.isFlipped) && (
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetReading}
              >
                <Ionicons name="reload" size={20} color="#fff" style={styles.resetButtonIcon} />
                <Text style={styles.resetButtonText}>Neue Legung</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
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
  subtitle: {
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'Lancelot_400Regular',
    }),
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  selectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  readingButton: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
    }),
  },
  readingButtonTitle: {
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'Lancelot_400Regular',
    }),
    fontSize: 22,
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  readingButtonDesc: {
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, sans-serif',
      default: undefined,
    }),
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  revealContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingVertical: 20,
  },
  cardsRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    marginTop: 20,
  },
  singleCardRow: {
    justifyContent: 'center',
  },
  cardContainer: {
    alignItems: 'center',
  },
  cardLabel: {
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'Lancelot_400Regular',
    }),
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  cardBack: {
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cardFront: {
    backgroundColor: '#fff',
  },
  cardName: {
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'Lancelot_400Regular',
    }),
    fontSize: 18,
    color: '#000',
    marginTop: 15,
    textAlign: 'center',
    maxWidth: 280,
  },
  cardDescription: {
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, sans-serif',
      default: undefined,
    }),
    fontSize: 15,
    color: '#444',
    marginTop: 12,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  resetButton: {
    marginTop: 40,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#000',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonIcon: {
    marginRight: 8,
  },
  resetButtonText: {
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, sans-serif',
      default: undefined,
    }),
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
