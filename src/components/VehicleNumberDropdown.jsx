import React, { useState, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
} from "react-native";
import { debounce } from "lodash";
import { getVehicleNumberListService } from "../services/dashboard.services";

const VehicleNumberDropdown = ({ onSelect }) => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleNumberList, setVehicleNumberList] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleGetVehicleNumberList = (text) => {
    const formData = new FormData();
    formData.append("VechileNo", text);
    formData.append("UserToken", "sdfsdf3355");
    formData.append("IP", "-1");
    formData.append("MAC", "ertetet");
    formData.append("GeoLocation", "20.25133,20.231464");
    formData.append("UserId", "25");

    // Replace this with your actual API call
    getVehicleNumberListService(formData)
      .then((res) => {
        setVehicleNumberList(res.data.result);
        setIsDropdownVisible(res.data.result.length > 0);
      })
      .catch((err) => console.log("Vehicle List Error", err));
  };

  const debouncedGetVehicleNumberList = useCallback(
    debounce(handleGetVehicleNumberList, 500),
    []
  );

  const handleTextChange = (text) => {
    setVehicleNumber(text);
    if (text.trim() === "") {
      setIsDropdownVisible(false);
      setVehicleNumberList([]);
    } else {
      debouncedGetVehicleNumberList(text);
    }
  };

  const handleSelect = (vehicle) => {
    setVehicleNumber(vehicle.number);
    setIsDropdownVisible(false);
    setVehicleNumberList([]);
    Keyboard.dismiss();
    setTimeout(() => {
      onSelect(vehicle); // Call parent only after dropdown completely dismissed
    }, 100);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Vehicle No"
        value={vehicleNumber}
        onChangeText={handleTextChange}
      />
      {isDropdownVisible && (
        <View style={styles.dropdown}>
          <FlatList
            data={vehicleNumberList}
            keyExtractor={(item) => item?.id?.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() =>
                  handleSelect({ number: item?.VechileNo, id: item?.id })
                }
              >
                <Text>{item?.VechileNo}</Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdown: {
    position: "absolute",
    top: 55, // Adjust based on input height
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 9999, // For iOS
    elevation: 15,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default VehicleNumberDropdown;
