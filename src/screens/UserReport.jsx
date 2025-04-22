import React, { useEffect, useState } from "react";
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
import {
  getDepartmentService,
  getDesignationService,
  getLocationsService,
} from "../services/auth.services";
const screenHeight = Dimensions.get("window").height;
function UserReport() {
  const [registrationId, setRegistrationId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);

  const isAnyFieldFilled =
    registrationId || mobileNo || name || designation || department || location;

  useEffect(() => {
    const formdata = new FormData();
    // formdata.append("NomnieeTypeId", "-1");
    // formdata.append("TitleId", "-1");
    // formdata.append("StateId", "-1");
    // formdata.append("CityId", "-1");
    formdata.append("LocationId", "-1");
    formdata.append("DesigantionID", "-1");
    formdata.append("DepartmentId", "-1");
    formdata.append("Status", "Z");
    formdata.append("UserToken", "");
    formdata.append("IP", "");
    formdata.append("MAC", "");
    formdata.append("UserId", "");
    formdata.append("GeoLocation", "");

    getDesignationService(formdata)
      .then((res) => {
        // console.log(res.data);
        setDesignations(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });

    getDepartmentService(formdata)
      .then((res) => {
        // console.log(res.data);
        setDepartments(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });

    getLocationsService(formdata)
      .then((res) => {
        // console.log(res.data?.result);
        setLocations(res.data?.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
              {designations &&
                designations.map((item) => {
                  return (
                    <Picker.Item
                      label={item?.Designation}
                      value={item?.DesignationID}
                      key={item?.DesignationID}
                    />
                  );
                })}
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
              {locations &&
                locations.map((item) => {
                  return (
                    <Picker.Item
                      label={item?.Location}
                      value={item?.LocationId}
                      key={item?.LocationId}
                    />
                  );
                })}
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
              {departments &&
                departments.map((item) => {
                  return (
                    <Picker.Item
                      label={item.Department}
                      value={item.DepartmentId}
                      key={item.DepartmentId}
                    />
                  );
                })}
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
