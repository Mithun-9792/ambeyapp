// components/ActionButton.js

import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const ActionButton = ({ title, ImageName, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Icon name={ImageName} size={28} color="white" />
      </View>
      {title && <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "orange",
    flex: 1,
    margin: 10,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  iconWrapper: {
    marginBottom: 8,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default ActionButton;
