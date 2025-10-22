import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import ThreeScene from '../components/ThreeScene';

interface PageProps {
  title: string;
}

export default function ChartPage({ title }: PageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>
      <ThreeScene />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
