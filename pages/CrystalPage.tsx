import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PageProps {
  title: string;
}

export default function CrystalPage({ title }: PageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>
      <View style={styles.content}>
        <Text style={styles.text}>Crystal Page Content</Text>
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
  },
});
