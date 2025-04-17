import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import { Picker } from "@react-native-picker/picker";
const screenHeight = Dimensions.get("window").height;
function UserReport() {
  const [registrationId, setRegistrationId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [isSearched, setIsSearched] = useState(false);

  const isAnyFieldFilled =
    registrationId || mobileNo || name || designation || department || location;

  const handleFilter = () => {
    // Perform your filter logic here
    console.log("Filter clicked");
    console.log("Registration ID:", registrationId);
    console.log("Mobile No:", mobileNo);
    console.log("Name:", name);
    console.log("Designation 1:", designation);
    console.log("Designation 2:", department);
    console.log("Designation 3:", location);

    // Set isSearched to true to indicate that the search has been performed
    setIsSearched(true);
  };

  const handleReset = () => {
    setRegistrationId("");
    setMobileNo("");
    setName("");
    setDesignation("");
    setDepartment("");
    setLocation("");
    setIsSearched(false);
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ minHeight: screenHeight - 100 }}>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { width: 140 }]}
            placeholder="Registration ID"
            value={registrationId}
            onChangeText={setRegistrationId}
            editable={!isAnyFieldFilled || registrationId.length > 0}
          />
          <Text
            style={{ color: "gray", fontWeight: 500, verticalAlign: "middle" }}
          >
            OR
          </Text>
          <TextInput
            style={[styles.input, { width: 140, marginLeft: 8 }]}
            placeholder="Mobile No"
            value={mobileNo}
            onChangeText={setMobileNo}
            keyboardType="phone-pad"
            editable={!isAnyFieldFilled || mobileNo.length > 0}
          />
          {/* <Text
            style={{ color: "gray", fontWeight: 500, verticalAlign: "middle" }}
          >
            OR
          </Text> */}
          <TextInput
            style={[styles.input, { width: 140, marginLeft: 0 }]}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            editable={!isAnyFieldFilled || name.length > 0}
          />
          <Text
            style={{ color: "gray", fontWeight: 500, verticalAlign: "middle" }}
          >
            OR
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={designation}
              onValueChange={(itemValue) => setDesignation(itemValue)}
              enabled={!isAnyFieldFilled || designation.length > 0}
              style={styles.picker}
              mode="dropdown"
            >
              <Picker.Item label="Select Designation" value={""} />
              <Picker.Item label="Director" value="Director" />
              <Picker.Item label="Driver" value="Driver" />
              <Picker.Item label="Accountant" value="Accountant" />
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={location}
              onValueChange={(itemValue) => setLocation(itemValue)}
              enabled={!isAnyFieldFilled || location.length > 0}
              style={styles.picker}
              mode="dropdown"
            >
              <Picker.Item label="Select Location" value={""} />
              <Picker.Item label="Lucknow" value="Lucknow" />
              <Picker.Item label="Kanpur" value="Kanpur" />
              <Picker.Item label="Hardoi" value="Hardoi" />
            </Picker>
          </View>
          <Text
            style={{ color: "gray", fontWeight: 500, verticalAlign: "middle" }}
          >
            OR
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={department}
              onValueChange={(itemValue) => setDepartment(itemValue)}
              enabled={!isAnyFieldFilled || department.length > 0}
              style={styles.picker}
              mode="dropdown"
            >
              <Picker.Item label="Select Department" value={""} />
              <Picker.Item label="Accounts" value="Accounts" />
              <Picker.Item label="HR" value="HR" />
              <Picker.Item label="IT" value="IT" />
            </Picker>
          </View>
        </View>
        <CustomButton
          btnText={isSearched ? "Reset" : "Search"}
          style={[styles.btn, { marginTop: 5, marginBottom: 10 }]}
          onPress={isSearched ? handleReset : handleFilter}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    padding: 10,
    gap: 5,
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    borderWidth: 1,
    borderColor: "#C9D3DB",
    borderStyle: "solid",
  },
  btn: {
    backgroundColor: "orange",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  pickerContainer: {
    width: 140,
    height: 50,
    backgroundColor: "#fff",
    // paddingHorizontal: 1,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
    borderWidth: 1,
    borderColor: "#C9D3DB",
    borderStyle: "solid",
    // flex: 1,
    marginBottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    height: 60,
    width: "100%",
    color: "#222",
  },
});

export default UserReport;
