// components/ActionButton.js

import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { COLORS } from "../constants/colors";

const ActionButton = ({ title, ImageName, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Icon name={ImageName} size={28} color={COLORS.primary} />
      </View>
      {title && <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.secondary,
    // flex: 1,
    width: "40%",
    margin: 10,
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    minHeight: 80,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  iconWrapper: {
    marginBottom: 2,
  },
  text: {
    color: COLORS.primary,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default ActionButton;
