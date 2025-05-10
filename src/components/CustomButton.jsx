import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

const CustomButton = ({ btnText, onPress, style, btnTextColor }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text
        style={[styles.buttonText, { color: btnTextColor || COLORS.primary }]}
      >
        {btnText}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // width: "100%",
    maxHeight: 50,
    // backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 12,
    margin: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomButton;
