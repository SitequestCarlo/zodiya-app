import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
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
    { id: 0, Icon: ChartIcon, name: 'Horoskop' },
    { id: 1, Icon: CrystalIcon, name: 'Kristalle' },
    { id: 2, Icon: GlassSphereIcon, name: 'Orakel' },
    { id: 3, Icon: TarotIcon, name: 'Tarot' },
  ];

  return (
    <>
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
            <View style={styles.iconContainer}>
              <tab.Icon
                width={28}
                height={28}
                color={isActive ? '#000' : '#7a7a7a'}
              />
            </View>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
    </>
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
    backgroundColor: '#f4f4f4',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    color: '#7a7a7a',
    fontWeight: '500',
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      default: undefined,
    }),
  },
  activeLabel: {
    color: '#000',
    fontWeight: '600',
  },
});
