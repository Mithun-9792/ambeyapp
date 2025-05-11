import React, { useState, useRef, useEffect } from "react";
import { Text, StyleSheet, Animated, Dimensions, View } from "react-native";
import { COLORS } from "../constants/colors";

const alertColors = {
  error: "#ff4d4f",
  warning: "#faad14",
  info: "#1890ff",
  success: COLORS.primary,
};

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function useToaster() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");

  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  const showAlert = (msg, alertType = "info") => {
    setMessage(msg);
    setType(alertType);
    setVisible(true);
  };

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Slide out after 2.5 seconds
      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: SCREEN_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setVisible(false));
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const AlertView = () =>
    visible ? (
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: alertColors[type],
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <Text style={styles.text}>{message}</Text>
      </Animated.View>
    ) : null;

  return { showAlert, AlertView };
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 5,
    left: 20,
    right: 0,
    padding: 10,
    zIndex: 999999,
    elevation: 10,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
