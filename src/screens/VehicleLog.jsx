import { Picker } from "@react-native-picker/picker";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native";
import CustomButton from "../components/CustomButton";
import {
  addMonthlyLogService,
  getClientListService,
  getMonthsListService,
  getVehicleNumberListService,
  getVehicleRunningMonthlyLogReport,
  getYearsListService,
} from "../services/dashboard.services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "../components/CustomAlert";
import { useRoute } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import VehicleNumberDropdown from "../components/VehicleNumberDropdown";

function VehicleLog() {
  const route = useRoute();
  const { isShowLogs } = route.params;
  const [clients, setClients] = useState([]);
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [yearNumber, setYearNumber] = useState(0);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleNumberId, setVehicleNumberId] = useState("");
  const [vehicleNumberList, setVehicleNumberList] = useState([]);
  const [dates, setDates] = useState([]);
  const [userData, setUserData] = useState({});
  const [isShow, setIsShow] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [modifiedDates, setModifiedDates] = useState([]);
  const [monthlyLogReports, setMonthlyLogReports] = useState([]);

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

    getClientListService(formData)
      .then((res) => {
        setClients(res.data.result);
      })
      .catch((err) => console.log("Client List Error", err));

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
  }, []);

  const getLogReportData = async () => {
    const formData = new FormData();
    formData.append("ClientId", "-1");
    formData.append("VechileRegisNo", vehicleNumber);
    formData.append("ContactPersonName", "");
    formData.append("MonthNmber", parseInt(selectedMonth));
    formData.append("YearNumber", parseInt(yearNumber));
    formData.append("UserToken", "usertoken342342324");
    formData.append("IP", "123.458.23.258");
    formData.append("MAC", "macaddress");
    formData.append("UserId", "25");
    formData.append("GeoLocation", "64.5644,54.6546");

    const response = await getVehicleRunningMonthlyLogReport(formData);
    // console.log("Log Report Data", response.data);
    if (response.data.ResponseStatus == 1) {
      setMonthlyLogReports(response.data.result);
      setDates(response.data.result);
    } else {
      setIsShow(true);
      setAlertType("error");
      setAlertMsg(response.data.ResponseMessage);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedDates = [...dates];
    updatedDates[index][field] = value;

    // Auto-calculate Total Km if Opening and Closing are filled
    if (field === "OpeningKm" || field === "ClosingKm") {
      const opening = parseFloat(updatedDates[index].OpeningKm) || 0;
      const closing = parseFloat(updatedDates[index].ClosingKm) || 0;
      updatedDates[index].TotalKm =
        closing > 0 && opening > 0 ? (closing - opening).toString() : "";
    }

    // Auto-calculate Avg Km per Ltr if Diesel Volume > 0
    if (field === "Amount" || field === "DieselRate") {
      const Amount = parseFloat(updatedDates[index].Amount) || 0;
      const DieselRate = parseFloat(updatedDates[index].DieselRate) || 0;
      updatedDates[index].DieselQTYLTR =
        DieselRate > 0 ? (Amount / DieselRate).toFixed(2) : "";
    }

    if (
      field === "TotalKm" ||
      field === "DieselQTYLTR" ||
      field === "Amount" ||
      field === "DieselRate"
    ) {
      const TotalKm = parseFloat(updatedDates[index].TotalKm) || 0;
      const DieselQTYLTR = parseFloat(updatedDates[index].DieselQTYLTR) || 0;
      updatedDates[index].Average =
        DieselQTYLTR > 0 ? (TotalKm / DieselQTYLTR).toFixed(2) : "";
    }

    // Save only the modified row in the modifiedDates state
    setModifiedDates((prev) => {
      const existingIndex = prev.findIndex((item) => item.index === index);
      if (existingIndex !== -1) {
        // Update the existing row
        const updatedModifiedDates = [...prev];
        updatedModifiedDates[existingIndex] = {
          index,
          data: updatedDates[index],
        };
        return updatedModifiedDates;
      } else {
        // Add a new row
        return [...prev, { index, data: updatedDates[index] }];
      }
    });

    setDates(updatedDates);
  };

  const generateDates = () => {
    if (!vehicleNumber) {
      alert("Please enter the vehicle number");
      return;
    }

    if (!selectedMonth || !selectedYear) {
      alert("Please select both month and year");
      return;
    }

    const numDays = new Date(selectedYear, selectedMonth, 0).getDate();
    const dateList = [];

    for (let day = 1; day <= numDays; day++) {
      const dateObj = new Date(selectedYear, selectedMonth - 1, day);
      const formattedDate = dateObj
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");

      dateList.push({
        CRDay1: formattedDate,
        OpeningKm: "",
        ClosingKm: "",
        TotalKm: "",
        Amount: "",
        DieselRate: "",
        DieselQTYLTR: "",
        Average: "",
        Narration: "",
      });
    }

    setDates(dateList);
  };

  const calculateTotals = () => {
    const allTotalKm = dates.reduce(
      (sum, item) => sum + (parseFloat(item.TotalKm) || 0),
      0
    );
    const totalDieselAmount = dates.reduce(
      (sum, item) => sum + (parseFloat(item.Amount) || 0),
      0
    );
    const totalDieselVolume = dates.reduce(
      (sum, item) => sum + (parseFloat(item.DieselQTYLTR) || 0),
      0
    );
    const Average =
      totalDieselVolume > 0 ? (allTotalKm / totalDieselVolume).toFixed(2) : 0;

    return { allTotalKm, totalDieselAmount, totalDieselVolume, Average };
  };

  const handleSubmit = () => {
    const modifiedRowsArray = modifiedDates.map((item) => ({
      OpeningKM: item?.data?.OpeningKm,
      ClosingKM: item?.data?.ClosingKm,
      LogDate: item?.data?.CRDay1, // or use item.BillDate if needed
      DieselAmount: item?.data?.Amount,
      DieselRate: item?.data?.DieselRate,
      narration: item?.data?.Narration,
      totalKm: item?.data?.TotalKm,
    }));
    // console.log(modifiedRowsArray, "Modified Rows Array");
    // return;
    const formData = new FormData();
    formData.append("LogListData", JSON.stringify(modifiedRowsArray));
    formData.append("MonthNmber", parseInt(selectedMonth) || 1);
    formData.append("YearNumber", parseInt(yearNumber) || "");
    formData.append("VenderVehicleId", parseInt(vehicleNumberId) || 21);
    formData.append("VechileRegisNo", vehicleNumber || "");
    formData.append("UserToken", userData?.UserToken);
    formData.append("IP", "1032.021.026");
    formData.append("MAC", "FDDFDFG56456");
    formData.append("UserId", userData.UserId);
    formData.append("GeoLocation", "26.8467° N, 80.9462° E");
    // console.log(formData);
    addMonthlyLogService(formData)
      .then((res) => {
        if (res.data.ResponseStatus == 1) {
          setIsShow(true);
          setAlertType("success");
          setAlertMsg(res.data.ResponseMessage);
          setModifiedDates([]);
          // setDates([]);
          // setVehicleNumber("");
          // setVehicleNumberId("");
          // setSelectedMonth("");
          // setSelectedYear("");
          // setYearNumber(-1);
        } else {
          setIsShow(true);
          setAlertType("error");
          setAlertMsg(res.data.ResponseMessage);
        }
      })
      .catch((err) => {
        setIsShow(true);
        setAlertType("error");
        setAlertMsg(err?.response?.data?.message);
      });
  };

  const totals = calculateTotals();

  // const debounce = (func, delay) => {
  //   let timeoutId;
  //   return (...args) => {
  //     if (timeoutId) clearTimeout(timeoutId);
  //     timeoutId = setTimeout(() => {
  //       func(...args);
  //     }, delay);
  //   };
  // };

  // function handleGetVehicleNumberList(text) {
  //   const formData = new FormData();
  //   formData.append("VechileNo", text);
  //   formData.append("UserToken", "sdfsdf3355");
  //   formData.append("IP", "-1");
  //   formData.append("MAC", "ertetet");
  //   formData.append("GeoLocation", "20.25133,20.231464");
  //   formData.append("UserId", "25");

  //   getVehicleNumberListService(formData)
  //     .then((res) => {
  //       // console.log(res.data);
  //       setVehicleNumberList(res.data.result);
  //     })
  //     .catch((err) => console.log("Client List Error", err));
  // }

  // const debouncedGetVehicleNumberList = useCallback(
  //   debounce(handleGetVehicleNumberList, 500),
  //   []
  // );

  // const handleTextChange = (text) => {
  //   setVehicleNumber(text); // Update input immediately
  //   debouncedGetVehicleNumberList(text); // Debounce filtering
  // };

  // const handleSelect = (vehicle) => {
  //   setVehicleNumber(vehicle);
  // };

  const handleVehicleSelect = (selectedVehicle) => {
    setVehicleNumber(selectedVehicle?.number); // Update the selected vehicle number
    setVehicleNumberId(selectedVehicle?.id); // Update the vehicle ID
    console.log("Selected Vehicle:", selectedVehicle);
  };

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
                    console.log(value, "sleected year");
                    setSelectedYear(value);
                    setYearNumber(value);
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
            <View style={{ zIndex: 10, marginBottom: 10 }}>
              <VehicleNumberDropdown onSelect={handleVehicleSelect} />
            </View>

            <CustomButton
              btnText={"Show"}
              // onPress={isShowLogs ? getLogReportData : generateDates}
              onPress={getLogReportData}
              style={{
                backgroundColor: COLORS.secondary,
                padding: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: COLORS.primary,
              }}
            />

            <ScrollView
              horizontal
              nestedScrollEnabled={true}
              scrollEnabled={true}
              contentContainerStyle={{ minWidth: "100%", paddingBottom: 20 }}
            >
              {/* Table Area */}
              <View style={{ marginTop: 30 }}>
                {/* Table Header */}
                {dates.length ? (
                  <View
                    style={{ flexDirection: "row", backgroundColor: "#e1ebff" }}
                  >
                    <Text style={[styles.cell, styles.headerCell]}>S.No</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Date</Text>
                    <Text style={[styles.cell, styles.headerCell]}>
                      Opening Km
                    </Text>
                    <Text style={[styles.cell, styles.headerCell]}>
                      Closing Km
                    </Text>
                    <Text style={[styles.cell, styles.headerCell]}>
                      Total Km
                    </Text>
                    <Text style={[styles.cell, styles.headerCell]}>
                      Diesel Amt
                    </Text>
                    <Text style={[styles.cell, styles.headerCell]}>
                      Diesel Rate
                    </Text>
                    <Text style={[styles.cell, styles.headerCell]}>
                      Diesel Vol
                    </Text>
                    <Text style={[styles.cell, styles.headerCell]}>
                      Avg Km/Ltr
                    </Text>
                    <Text style={[styles.cell, styles.headerCell]}>
                      Narration
                    </Text>
                  </View>
                ) : null}

                {/* Table Body */}
                {dates.map((item, index) => (
                  <View
                    key={item?.CRDay1 || item?.CRDay1}
                    style={{ flexDirection: "row" }}
                  >
                    <Text style={styles.cell}>{index + 1}</Text>
                    <Text style={styles.cell}>
                      {item?.CRDay1 || item?.CRDay1}
                    </Text>
                    <View style={styles.cellInput}>
                      <TextInput
                        style={{
                          textAlign: "center",
                          textAlignVertical: "center", // Vertically center the text
                          paddingVertical: 0,
                        }}
                        value={item?.OpeningKm}
                        keyboardType="numeric"
                        onChangeText={(text) =>
                          handleInputChange(index, "OpeningKm", text)
                        }
                        readOnly={isShowLogs}
                        editable={!isShowLogs}
                      />
                    </View>
                    <View style={styles.cellInput}>
                      <TextInput
                        style={{
                          textAlign: "center",
                          textAlignVertical: "center", // Vertically center the text
                          paddingVertical: 0,
                        }}
                        value={item?.ClosingKm}
                        keyboardType="numeric"
                        onChangeText={(text) =>
                          handleInputChange(index, "ClosingKm", text)
                        }
                        readOnly={isShowLogs}
                        editable={!isShowLogs}
                      />
                    </View>
                    <Text style={[styles.cell, { backgroundColor: "#e1ebff" }]}>
                      {item?.TotalKm}
                    </Text>
                    <View style={styles.cellInput}>
                      <TextInput
                        style={{
                          textAlign: "center",
                          textAlignVertical: "center", // Vertically center the text
                          paddingVertical: 0,
                        }}
                        value={item?.Amount}
                        keyboardType="numeric"
                        onChangeText={(text) =>
                          handleInputChange(index, "Amount", text)
                        }
                        readOnly={isShowLogs}
                        editable={!isShowLogs}
                      />
                    </View>
                    <View style={styles.cellInput}>
                      <TextInput
                        style={{
                          textAlign: "center",
                          textAlignVertical: "center", // Vertically center the text
                          paddingVertical: 0,
                        }}
                        value={item.DieselRate}
                        keyboardType="numeric"
                        onChangeText={(text) =>
                          handleInputChange(index, "DieselRate", text)
                        }
                        readOnly={isShowLogs}
                        editable={!isShowLogs}
                      />
                    </View>
                    <View style={styles.cellInput}>
                      <TextInput
                        style={{
                          textAlign: "center",
                          textAlignVertical: "center", // Vertically center the text
                          paddingVertical: 0,
                        }}
                        value={item.DieselQTYLTR || item?.DieselQTYLTR}
                        keyboardType="numeric"
                        onChangeText={(text) =>
                          handleInputChange(index, "DieselQTYLTR", text)
                        }
                        readOnly={isShowLogs}
                        editable={!isShowLogs}
                      />
                    </View>
                    <Text style={[styles.cell, { backgroundColor: "#e1ebff" }]}>
                      {item.Average || item?.Average}
                    </Text>
                    <View style={styles.cellInput}>
                      <TextInput
                        style={{
                          textAlign: "center",
                          textAlignVertical: "center", // Vertically center the text
                          paddingVertical: 0,
                        }}
                        value={item.Narration}
                        onChangeText={(text) =>
                          handleInputChange(index, "Narration", text)
                        }
                        readOnly={isShowLogs}
                        editable={!isShowLogs}
                      />
                    </View>
                  </View>
                ))}

                {/* Totals Row */}
                {dates.length && !isShowLogs ? (
                  <View
                    style={{ flexDirection: "row", backgroundColor: "#f0f0f0" }}
                  >
                    <Text style={styles.cell}>-</Text>
                    <Text style={styles.cell}>Totals</Text>
                    <Text style={styles.cell}></Text>
                    <Text style={styles.cell}></Text>
                    <Text style={[styles.cell, { fontWeight: "bold" }]}>
                      {totals.allTotalKm}
                    </Text>
                    <Text style={[styles.cell, { fontWeight: "bold" }]}>
                      {totals.totalDieselAmount?.toFixed(2)}
                    </Text>
                    <Text style={styles.cell}></Text>
                    <Text style={[styles.cell, { fontWeight: "bold" }]}>
                      {totals.totalDieselVolume?.toFixed(2)}
                    </Text>
                    <Text style={[styles.cell, { fontWeight: "bold" }]}>
                      {totals.Average}
                    </Text>
                    <Text style={styles.cell}></Text>
                  </View>
                ) : null}
              </View>
            </ScrollView>

            {dates.length && !isShowLogs ? (
              <CustomButton
                btnText={"Submit"}
                onPress={handleSubmit}
                style={{
                  backgroundColor: COLORS.secondary,
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 20,
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                }}
                btnTextColor={COLORS.primary}
              />
            ) : null}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      <CustomAlert
        visible={isShow}
        message={alertMsg}
        type={alertType}
        setVisible={setIsShow}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  row: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "center",
  },
  cell: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: 110,
    height: 50,
    textAlign: "center",
    textAlignVertical: "center",
  },
  headerCell: {
    backgroundColor: "#e1ebff",
    fontWeight: "bold",
  },

  cellInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 110,
    height: 50,
    padding: 5,
    fontSize: 14,
    color: "#333",
    justifyContent: "center",
    alignItems: "center",
  },

  headerText: {
    fontWeight: "bold",
    backgroundColor: "#f8f8f8",
  },
});

export default VehicleLog;
