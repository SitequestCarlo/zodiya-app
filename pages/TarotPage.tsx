import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

interface PageProps {
  title: string;
}

export default function TarotPage({ title }: PageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>
      <View style={styles.content}>
        <Text style={styles.text}>Tarot Page Content</Text>
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});
