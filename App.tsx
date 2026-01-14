import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Animated, Dimensions, View, ActivityIndicator } from 'react-native';
import { useFonts, Lancelot_400Regular } from '@expo-google-fonts/lancelot';
import { useState, useRef, useEffect } from 'react';
import BottomNavbar from './components/BottomNavbar';
import ChartPage from './pages/ChartPage';
import CrystalPage from './pages/CrystalPage';
import SpherePage from './pages/SpherePage';
import TarotPage from './pages/TarotPage';

const { width } = Dimensions.get('window');

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [prevTab, setPrevTab] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  let [fontsLoaded, fontError] = useFonts({
    Lancelot_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      console.log('Fonts loaded successfully');
    }
    if (fontError) {
      console.error('Font loading error:', fontError);
    }
  }, [fontsLoaded, fontError]);

  const pages = [
    { id: 0, component: ChartPage, title: 'Horoskop' },
    { id: 1, component: CrystalPage, title: 'Kristalle' },
    { id: 2, component: SpherePage, title: 'Orakel' },
    { id: 3, component: TarotPage, title: 'Tarot' },
  ];

  useEffect(() => {
    const direction = activeTab > prevTab ? 1 : -1;
    slideAnim.setValue(direction * width);
    
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start();
  }, [activeTab]);

  const handleTabChange = (tabId: number) => {
    setPrevTab(activeTab);
    setActiveTab(tabId);
  };

  if (!fontsLoaded && !fontError) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const CurrentPage = pages[activeTab].component;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pageContainer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <CurrentPage title={pages[activeTab].title} />
      </Animated.View>
      <BottomNavbar activeTab={activeTab} onTabChange={handleTabChange} />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pageContainer: {
    flex: 1,
    maxWidth: 400,
    width: '100%',
    marginHorizontal: 'auto',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
