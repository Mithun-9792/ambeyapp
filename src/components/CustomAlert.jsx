import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";

const alertColors = {
  error: "#ff4d4f",
  warning: "#faad14",
  info: "#1890ff",
  success: "#52c41a",
};

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function CustomAlert({
  visible,
  message,
  type = "info",
  setVisible,
}) {
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-hide after 3s
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

  if (!visible) return null;

  return (
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
  );
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
