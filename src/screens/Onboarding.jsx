import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import { SCREENS } from "../constants/route";

export default function OnboardingScreen({ navigation }) {
  const animation = useRef(null);
  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userData");
      if (jsonValue != null) {
        const userData = JSON.parse(jsonValue);
        navigation.replace(SCREENS.DASHBOARD);
      }
    } catch (error) {
      console.error("Error retrieving user data", error);
    }
  };
  getUserData()
  const handleGetStarted = async () => {
    await AsyncStorage.setItem("@viewedOnboarding", "true");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <LottieView
        ref={animation}
        autoPlay
        loop
        source={require("../assets/onboarding.json")}
        style={styles.lottie}
      />
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>WELCOME TO</Text>
        <Text style={styles.companyText}>AMBEY ENTERPRISES</Text>
      </View>
      <Text style={styles.subtitle}>Your journey starts here!</Text>

      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: { width: 300, height: 300 },
  title: { fontSize: 28, fontWeight: "bold", marginVertical: 20 },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 40 },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  textContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "orange",
  },
  companyText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#333",
  },
});
