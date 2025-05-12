import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import VehicleNumberDropdown from "../components/VehicleNumberDropdown";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  getAttendenceReportService,
  getMonthsListService,
  getYearsListService,
} from "../services/dashboard.services";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/colors";
import { Text } from "react-native";
import { TextInput } from "react-native";
import useToaster from "../hooks/useToaster";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import AsyncStorage from "@react-native-async-storage/async-storage";

function AttendenceReport() {
  const { showAlert, AlertView } = useToaster();
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    `0${new Date().getMonth() + 1}`.slice(-2)
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [registrationId, setRegistrationId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [userData, setUserData] = useState({});
  const [attendanceData, setAttendanceData] = useState();

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
    getUserData();
    const formData = new FormData();
    formData.append("BankID", "-1");
    formData.append("BranchId", "-1");
    formData.append("Branch", "");
    formData.append("ContactPersonName", "");
    formData.append("UserToken", "sdfsdf3355");
    formData.append("IP", "-1");
    formData.append("MAC", "ertetet");
    formData.append("GeoLocation", "20.25133,20.231464");
    formData.append("UserId", "25");

    // getClientListService(formData)
    //   .then((res) => {
    //     setClients(res.data.result);
    //   })
    //   .catch((err) => console.log("Client List Error", err));

    getMonthsListService(formData)
      .then((res) => {
        setMonths(res.data?.result);
      })
      .catch((err) => console.log("Months List Error", err));

    getYearsListService(formData)
      .then((res) => {
        setYears(res.data?.result);
      })
      .catch((err) => console.log("Years List Error", err));

    getAttendence();
  }, []);

  const handleGetAttendanceReport = () => {
    if (registrationId.length === 0 && mobileNo.length === 0) {
      showAlert("Please enter Registration ID or Mobile No", "info");
      return;
    }
    setIsSearched(true);
    getAttendence();
  };

  const getAttendence = () => {
    console.log("calling attendance");
    const formData = new FormData();
    formData.append("RegistrationCode", registrationId || "");
    formData.append("MobileNo", mobileNo.toString() || "");
    formData.append("Year", selectedYear || "2025");
    formData.append("Month", selectedMonth || "05");
    formData.append("UserToken", userData?.UserToken || "");
    formData.append("IP", "102.253.658.20");
    formData.append("MAC", "MAC24323423");
    formData.append("UserId", userData.UserId || 15);
    formData.append("GeoLocation", "25.251452,36.25478");

    getAttendenceReportService(formData)
      .then((res) => {
        // console.log(res.data?.result);
        setAttendanceData(res.data?.result);
      })
      .catch((err) => {
        console.log("Attendance Report Error", err);
      });
  };

  const handleReset = () => {
    setRegistrationId("");
    setMobileNo("");
    setIsSearched(false);
    setAttendanceData([]);
    setSelectedMonth(`0${new Date().getMonth() + 1}`.slice(-2));
    setSelectedYear(new Date().getFullYear());
    // getAttendence();
  };

  const renderItem = ({ item, index }) => (
    <ScrollView horizontal>
      <View style={styles.rowTable}>
        <Text style={styles.cell}>{index + 1}</Text>
        <Text style={styles.cell}>{item.RegistrationCode}</Text>
        <Text style={styles.cell}>{item.Name}</Text>
        {/* <Text style={styles.cell}>{item.MobileNo}</Text> */}
        <Text style={styles.cell}>{item.Designation}</Text>
        {/* <Text style={styles.cell}>{item.Department}</Text> */}
        <Text style={styles.cell}>{item.WorkLocation}</Text>
        {/* <Text style={styles.cell}>{item.RM}</Text> */}
        {/* <Text style={styles.cell}>{item.RMRegisCode}</Text> */}
        <Text style={styles.cell}>{item.Month}</Text>
        <Text style={styles.cell}>{item.Year}</Text>
        <Text style={styles.cell}>{item.MonthTotalDays}</Text>
        <Text style={styles.cell}>{item.TotalPresent}</Text>
        <Text style={styles.cell}>{item.TotalLeave}</Text>
        <Text style={styles.cell}>{item.MonthOff}</Text>
      </View>
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          // keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20, // Add padding to ensure the button is visible
          }}
        >
          <View style={{ padding: 30 }}>
            <View style={[styles.row, { marginBottom: 5 }]}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input]}
                  placeholder="Registration ID"
                  value={registrationId}
                  onChangeText={setRegistrationId}
                  readOnly={mobileNo.length > 0 || isSearched}
                />
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input]}
                  placeholder="Mobile No"
                  value={mobileNo}
                  onChangeText={setMobileNo}
                  keyboardType="phone-pad"
                  readOnly={registrationId.length > 0 || isSearched}
                />
              </View>
            </View>
            <View
              style={[styles.inputControl, { flexDirection: "row", gap: 5 }]}
            >
              <View style={[styles.pickerContainer, { flex: 1, zIndex: 1 }]}>
                <Picker
                  selectedValue={selectedMonth}
                  onValueChange={(value) => {
                    setSelectedMonth(value);
                  }}
                  style={styles.picker}
                  mode="dropdown"
                >
                  <Picker.Item label="Month" value="" />
                  {months?.map((item) => (
                    <Picker.Item
                      label={item.MonthName}
                      value={item.MonthNumber}
                      key={item.MonthNumber}
                    />
                  ))}
                </Picker>
              </View>
              <View style={[styles.pickerContainer, { flex: 1 }]}>
                <Picker
                  selectedValue={selectedYear}
                  onValueChange={(value) => {
                    setSelectedYear(value);
                  }}
                  style={styles.picker}
                  mode="dropdown"
                >
                  <Picker.Item label="Year" value="" />
                  {years?.map((item) => (
                    <Picker.Item
                      label={item.Year}
                      value={item?.Value}
                      key={item.YearId}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <CustomButton
              btnText={isSearched ? "Reset" : "Search"}
              onPress={
                isSearched
                  ? () => {
                      handleReset();
                      getAttendence();
                    }
                  : handleGetAttendanceReport
              }
              //   onPress={getLogReportData}
              style={{
                backgroundColor: COLORS.secondary,
                padding: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: COLORS.primary,
              }}
            />

            <ScrollView horizontal>
              <View>
                <View style={styles.header}>
                  <Text style={[styles.headerCell, styles.cell]}>Sr.No</Text>
                  <Text style={[styles.headerCell, styles.cell]}>Reg Code</Text>
                  <Text style={[styles.headerCell, styles.cell]}>Name</Text>
                  {/* <Text style={[styles.headerCell, styles.cell]}>Mobile</Text> */}
                  <Text style={[styles.headerCell, styles.cell]}>
                    Designation
                  </Text>
                  {/* <Text style={[styles.headerCell, styles.cell]}>
                    Department
                  </Text> */}
                  <Text style={[styles.headerCell, styles.cell]}>
                    Working Location
                  </Text>
                  {/* <Text style={[styles.headerCell, styles.cell]}>R.M</Text>
                  <Text style={[styles.headerCell, styles.cell]}>
                    R.M RegisCode
                  </Text> */}
                  <Text style={[styles.headerCell, styles.cell]}>Month</Text>
                  <Text style={[styles.headerCell, styles.cell]}>Year</Text>
                  <Text style={[styles.headerCell, styles.cell]}>
                    Month Days
                  </Text>
                  <Text style={[styles.headerCell, styles.cell]}>Present</Text>
                  <Text style={[styles.headerCell, styles.cell]}>Leave</Text>
                  <Text style={[styles.headerCell, styles.cell]}>
                    Month Off
                  </Text>
                </View>

                <FlatList
                  data={attendanceData}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.MemberID}
                />
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      <AlertView />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    backgroundColor: "#eee",
    // padding: 5,
  },
  row: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
  },
  inputWrapper: {
    flex: 1,
  },
  inputControl: {
    marginBottom: 5,
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    borderWidth: 1,
    borderColor: "#C9D3DB",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 4,
    borderRadius: 5,
    maxHeight: 150,
    backgroundColor: "#f1f1f1",
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  pickerContainer: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C9D3DB",
    flex: 1,
    marginBottom: 10,
    justifyContent: "center",
  },
  picker: {
    height: 60,
    width: "100%",
    color: "#222",
  },
  rowTable: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "center",
    // padding: 5,
  },
  headerCell: {
    backgroundColor: "#e1ebff",
    fontWeight: "bold",
  },

  cell: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: 120,
    height: 45,
    textAlign: "center",
    textAlignVertical: "center",
  },
  btn: {
    backgroundColor: COLORS.secondary,
    maxHeight: 45,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
});

export default AttendenceReport;
