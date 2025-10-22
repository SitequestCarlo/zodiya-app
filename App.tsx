import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Animated, Dimensions, View, ActivityIndicator, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    { id: 0, component: ChartPage, title: 'Natal Chart' },
    { id: 1, component: CrystalPage, title: 'Crystal Ball' },
    { id: 2, component: SpherePage, title: 'Glass Sphere' },
    { id: 3, component: TarotPage, title: 'Tarot Reading' },
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
      <LinearGradient
        colors={['#182845', '#335277']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
        </View>
      </LinearGradient>
    );
  }

  const CurrentPage = pages[activeTab].component;

  return (
    <LinearGradient
      colors={['#182845', '#335277']}
      style={styles.container}
    >
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
      <StatusBar style="light" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
