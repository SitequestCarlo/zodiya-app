import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassSphere from '../components/GlassSphere';
import type { StoredUserData } from '../utils/storage';

interface PageProps {
  title: string;
  userData?: StoredUserData;
  onResetData?: () => void;
}

export default function SpherePage({ title }: PageProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20), paddingBottom: insets.bottom + 90 }]}>
      <Text style={styles.heading}>{title}</Text>
      <GlassSphere />
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
});
