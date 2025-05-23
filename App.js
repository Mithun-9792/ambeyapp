import { NavigationContainer } from "@react-navigation/native";
import { useCallback, useContext } from "react";
import * as SplashScreen from "expo-splash-screen";
import { AppStack, Routes } from "./src/Routes";
import { AuthContext, AuthProvider } from "./src/authContext/AuthContext";

// Prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

function MainNavigator() {
  const { isAuthenticated, showOnboarding, appReady } = useContext(AuthContext);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) await SplashScreen.hideAsync();
  }, [appReady]);

  if (!appReady) return null;

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      {!isAuthenticated ? <AppStack /> : <Routes />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}
