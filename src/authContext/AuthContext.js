// src/context/AuthContext.js

import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(null);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const checkAuthAndOnboarding = async () => {
      try {
        const onboardingValue = await AsyncStorage.getItem("@viewedOnboarding");
        const userData = await AsyncStorage.getItem("userData");

        setShowOnboarding(onboardingValue == "true");
        setIsAuthenticated(!!userData);
      } catch (error) {
        console.log("AuthContext error:", error);
      } finally {
        setAppReady(true);
      }
    };

    checkAuthAndOnboarding();
  }, []);

  const login = async (userData) => {
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userData");
    setIsAuthenticated(false);
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem("@viewedOnboarding", "true");
    setShowOnboarding(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        showOnboarding,
        completeOnboarding,
        appReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
