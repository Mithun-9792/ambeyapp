import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import Routes from "./src/Routes";
import OnboardingScreen from "./src/screens/Onboarding";

// Prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(null);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem("@viewedOnboarding");
        setShowOnboarding(value !== "true");
      } catch (error) {
        console.warn("Error checking onboarding:", error);
      } finally {
        setAppReady(true); // Mark the app as ready after checking AsyncStorage
      }
    };
    checkOnboarding();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) return null;

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      {/* {showOnboarding ? <OnboardingScreen /> : <Routes />} */}
      <Routes />
    </NavigationContainer>
  );
}
