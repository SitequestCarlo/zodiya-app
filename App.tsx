import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Animated, Dimensions, View, ActivityIndicator } from 'react-native';
import { useFonts, Lancelot_400Regular } from '@expo-google-fonts/lancelot';
import { useState, useRef, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomNavbar from './components/BottomNavbar';
import HomePage from './pages/HomePage';
import ChartPage from './pages/ChartPage';
import CrystalPage from './pages/CrystalPage';
import SpherePage from './pages/SpherePage';
import TarotPage from './pages/TarotPage';
import OnboardingPage from './pages/OnboardingPage';
import { getUserData, saveUserData, StoredUserData } from './utils/storage';
import type { UserData } from './pages/OnboardingPage';

const { width } = Dimensions.get('window');

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [prevTab, setPrevTab] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [userData, setUserData] = useState<StoredUserData | null>(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  let [fontsLoaded, fontError] = useFonts({
    Lancelot_400Regular,
  });

  // Check for existing user data on mount
  useEffect(() => {
    checkUserData();
  }, []);

  const checkUserData = async () => {
    try {
      const data = await getUserData();
      setUserData(data);
    } catch (error) {
      console.error('Error checking user data:', error);
    } finally {
      setIsCheckingOnboarding(false);
    }
  };

  const handleOnboardingComplete = async (newUserData: UserData) => {
    try {
      await saveUserData(newUserData);
      const storedData = await getUserData();
      setUserData(storedData);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  useEffect(() => {
    if (fontsLoaded) {
      console.log('Fonts loaded successfully');
    }
    if (fontError) {
      console.error('Font loading error:', fontError);
    }
  }, [fontsLoaded, fontError]);

  const pages = [
    { id: 0, component: HomePage, title: 'Zuhause' },
    { id: 1, component: ChartPage, title: 'Horoskop' },
    { id: 2, component: CrystalPage, title: 'Kristalle' },
    { id: 3, component: SpherePage, title: 'Orakel' },
    { id: 4, component: TarotPage, title: 'Tarot' },
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

  const handleResetData = () => {
    setUserData(null);
    setActiveTab(0);
  };

  if (isCheckingOnboarding || (!fontsLoaded && !fontError)) {
    return (
      <SafeAreaProvider>
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaProvider>
    );
  }

  // Show onboarding if user hasn't completed it
  if (!userData?.onboardingCompleted) {
    return (
      <SafeAreaProvider>
        <OnboardingPage onComplete={handleOnboardingComplete} />
      </SafeAreaProvider>
    );
  }

  const CurrentPage = pages[activeTab].component;

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.pageContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <CurrentPage 
            title={pages[activeTab].title} 
            userData={userData}
            onResetData={activeTab === 0 ? handleResetData : undefined}
            onNavigate={activeTab === 0 ? handleTabChange : undefined}
          />
        </Animated.View>
        <BottomNavbar activeTab={activeTab} onTabChange={handleTabChange} />
        <StatusBar style="dark" />
      </View>
    </SafeAreaProvider>
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
