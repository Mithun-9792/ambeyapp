import React from "react";
import { View, Text, StyleSheet } from "react-native";

const alertColors = {
  error: "#ff4d4f",
  warning: "#faad14",
  info: "#1890ff",
  success: "#52c41a",
};

export default function CustomAlert({
  visible,
  message,
  type = "info",
  setVisible,
}) {
  if (!visible) return null;
  if (visible) {
    setTimeout(() => {
      setVisible(false);
    }, 3000);
  }
  return (
    <View style={[styles.container, { backgroundColor: alertColors[type] }]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    // top: 50,
    left: 20,
    right: 20,
    bottom:0,
    padding: 15,
    borderRadius: 8,
    zIndex: 999,
    elevation: 10,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
