import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import { Picker } from "@react-native-picker/picker";
import {
  getDepartmentService,
  getDesignationService,
  getEmployeeDetail,
  getLocationsService,
} from "../services/auth.services";
import { SCREENS } from "../constants/route";
import CustomAlert from "../components/CustomAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../constants/colors";
const screenHeight = Dimensions.get("window").height;
function UserReport({ navigation }) {
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
  const [isShow, setIsShow] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [employeeData, setEmployeeData] = useState();
  const [userData, setUserData] = useState({});

  const isAnyFieldFilled =
    registrationId || mobileNo || name || designation || department || location;

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userData");
      if (jsonValue != null) {
        const userData = JSON.parse(jsonValue);
        setUserData(userData);
        return userData;
      }
    } catch (error) {
      console.error("Error retrieving user data", error);
    }
  };

  useEffect(() => {
    const formdata = new FormData();
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
    getUserData();
    handleSearch();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [isSearched]);

  function handleSearch() {
    const formData = new FormData();
    formData.append("MemberID", "-1");
    formData.append("Name", name || "");
    formData.append("RegCode", registrationId || "");
    formData.append("MobileNo", mobileNo.toString() || "");
    formData.append("Status", "Z");
    formData.append("M32_DepartmentId", parseInt(department) || -1);
    formData.append("M14_DesignationID", parseInt(designation) || -1);
    formData.append("M33_LocationId", parseInt(location) || -1);
    formData.append("StaffTypeCode", "Z");
    formData.append("UserToken", userData?.UserToken || "");
    formData.append("UserId", userData.UserId || 15);
    formData.append("IP", "");
    formData.append("MAC", "");
    formData.append("DocTypeId", "-1");
    formData.append("GeoLocation", "56.225551,58.5646");

    getEmployeeDetail(formData)
      .then((res) => {
        // console.log("Employee Details:", res.data.result);
        if (res.data.ResponseStatus == 1) {
          setEmployeeData(res.data.result);
        } else {
          setAlertType("info");
          setAlertMsg(res.data.ResponseMessage);
          setIsShow(true);
        }
      })
      .catch((err) => {
        console.log("Error fetching employee details:", err);
      });
  }

  const handleFilter = () => {
    if (
      registrationId.length === 0 &&
      mobileNo.length === 0 &&
      name.length === 0 &&
      (designation === -1 || designation.length === 0) &&
      (department === -1 || department.length === 0) &&
      (location === -1 || location.length === 0)
    ) {
      setAlertType("info");
      setAlertMsg("Please fill any field to filter data.");
      setIsShow(true);
      return;
    }

    // console.log(location, "location", department, designation);
    setIsSearched(true);
    handleSearch();
    // const formData = new FormData();
    // formData.append("MemberID", "-1");
    // formData.append("Name", name || "");
    // formData.append("RegCode", registrationId || "");
    // formData.append("MobileNo", mobileNo.toString() || "");
    // formData.append("Status", "Z");
    // formData.append("M32_DepartmentId", parseInt(department) || -1);
    // formData.append("M14_DesignationID", parseInt(designation) || -1);
    // formData.append("M33_LocationId", parseInt(location) || -1);
    // formData.append("StaffTypeCode", "Z");
    // formData.append("UserToken", userData?.UserToken || "");
    // formData.append("UserId", userData.UserId || "");
    // formData.append("IP", "");
    // formData.append("MAC", "");
    // formData.append("DocTypeId", "-1");
    // formData.append("GeoLocation", "56.225551,58.5646");

    // getEmployeeDetail(formData)
    //   .then((res) => {
    //     console.log("Employee Details:", res.data, res.data.result.length);
    //     if (res.data.ResponseStatus == 1) {
    //       setEmployeeData(res.data.result);
    //     } else {
    //       setAlertType("info");
    //       setAlertMsg(res.data.ResponseMessage);
    //       setIsShow(true);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("Error fetching employee details:", err);
    //   });
  };

  const handleReset = () => {
    setRegistrationId("");
    setMobileNo("");
    setName("");
    setDesignation("");
    setDepartment("");
    setLocation("");
    setIsSearched(false);
    setEmployeeData();
    handleSearch();
  };

  const renderItem = ({ item }) => (
    <View style={styles.Tablerow}>
      <Text style={styles.cell}>{item.RegistrationCode}</Text>
      <Text style={styles.cell}>{item.Name}</Text>
      <Text style={styles.cell}>{item.MobileNo}</Text>

      <CustomButton
        btnText={"Edit"}
        style={[styles.btn, styles.cell, { marginTop: 5, marginBottom: 10 }]}
        onPress={isSearched ? handleReset : handleFilter}
      />
      <CustomButton
        btnText={"View/Update"}
        style={[styles.btn, styles.cell, { marginTop: 5, marginBottom: 10 }]}
        onPress={isSearched ? handleReset : handleFilter}
      />
    </View>
  );

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
          btnTextColor={COLORS.primary}
        />

        {!employeeData ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator color={COLORS.primary} size={"large"} />
          </View>
        ) : (
          <ScrollView horizontal>
            <View>
              {/* Table Header */}
              <View style={[styles.Tablerow, { backgroundColor: "#eee" }]}>
                {[
                  "Registration Code",
                  "Name",
                  "Mobile No",
                  "Edit",
                  "View/Update Doc",
                ].map((heading, idx) => (
                  <Text key={idx} style={[styles.cell, styles.headerCell]}>
                    {heading}
                  </Text>
                ))}
              </View>

              {/* Table Body (Row Data) */}
              {employeeData?.map((item, index) => (
                <View key={index} style={styles.Tablerow}>
                  <Text style={styles.cell}>{item.RegistrationCode}</Text>
                  <Text style={styles.cell}>{item.Name}</Text>
                  <Text style={styles.cell}>{item.MobileNo}</Text>

                  <View style={styles.cellWrapper}>
                    <CustomButton
                      btnText={"Edit"}
                      style={styles.tableBtn}
                      onPress={() =>
                        navigation.push(SCREENS.EMPLOYEEREGISTRATION, {
                          isNew: false,
                          employeeData: item,
                        })
                      }
                    />
                  </View>
                  <View style={styles.cellWrapper}>
                    <CustomButton
                      btnText={"View/Update"}
                      style={styles.tableBtn}
                      onPress={() =>
                        navigation.push(SCREENS.EMPLOYEEUPLOADDOC, {
                          userRegistrationId: item.RegistrationCode,
                        })
                      }
                    />
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </ScrollView>
      <CustomAlert
        visible={isShow}
        message={alertMsg}
        type={alertType}
        setVisible={setIsShow}
      />
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
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
  Tablerow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "space-between",
  },
  cell: {
    minWidth: 140,
    // paddingHorizontal: 5,
    color: "#333",
    textAlign: "center",
  },
  headerCell: {
    fontWeight: "bold",
  },
  cellWrapper: {
    width: 140,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    // borderRightWidth: 1,
    // borderColor: "#ccc",
  },

  tableBtn: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
});

export default UserReport;
