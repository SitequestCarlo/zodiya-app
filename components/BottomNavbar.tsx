import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import ChartIcon from './icons/ChartIcon';
import CrystalIcon from './icons/CrystalIcon';
import GlassSphereIcon from './icons/GlassSphereIcon';
import TarotIcon from './icons/TarotIcon';

interface BottomNavbarProps {
  activeTab: number;
  onTabChange: (tabId: number) => void;
}

export default function BottomNavbar({ activeTab, onTabChange }: BottomNavbarProps) {
  const tabs = [
    { id: 0, Icon: ChartIcon, name: 'Chart' },
    { id: 1, Icon: CrystalIcon, name: 'Crystal' },
    { id: 2, Icon: GlassSphereIcon, name: 'Sphere' },
    { id: 3, Icon: TarotIcon, name: 'Tarot' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.button}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, isActive && styles.activeIconCircle]}>
              <tab.Icon 
                width={24} 
                height={24} 
                color={isActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.8)'} 
              />
            </View>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(24, 40, 69, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeIconCircle: {
    backgroundColor: 'rgba(24, 40, 69, 0.95)',
    borderColor: 'rgba(212, 175, 55, 0.5)',
    borderWidth: 2,
  },
  label: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#D4AF37',
    fontWeight: '600',
  },
});
