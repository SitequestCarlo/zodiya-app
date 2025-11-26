import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassSphere from '../components/GlassSphere';

interface PageProps {
  title: string;
}

export default function SpherePage({ title }: PageProps) {
  return (
    <View style={styles.container}>
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
    fontFamily: 'Lancelot_400Regular',
    fontSize: 32,
    color: '#000',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
});
