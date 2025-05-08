import { Picker } from "@react-native-picker/picker";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
    console.log("Log Report Data", response.data);
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
    if (field === "OpeningKM" || field === "ClosingKM") {
      const opening = parseFloat(updatedDates[index].OpeningKM) || 0;
      const closing = parseFloat(updatedDates[index].ClosingKM) || 0;
      updatedDates[index].totalKm =
        closing > 0 && opening > 0 ? (closing - opening).toString() : "";
    }

    // Auto-calculate Avg Km per Ltr if Diesel Volume > 0
    if (field === "DieselAmount" || field === "DieselRate") {
      const DieselAmount = parseFloat(updatedDates[index].DieselAmount) || 0;
      const DieselRate = parseFloat(updatedDates[index].DieselRate) || 0;
      updatedDates[index].dieselVolume =
        DieselRate > 0 ? (DieselAmount / DieselRate).toFixed(2) : "";
    }

    if (
      field === "totalKm" ||
      field === "dieselVolume" ||
      field === "DieselAmount" ||
      field === "DieselRate"
    ) {
      const totalKm = parseFloat(updatedDates[index].totalKm) || 0;
      const dieselVolume = parseFloat(updatedDates[index].dieselVolume) || 0;
      updatedDates[index].avgKmPerLtr =
        dieselVolume > 0 ? (totalKm / dieselVolume).toFixed(2) : "";
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
        LogDate: formattedDate,
        OpeningKM: "",
        ClosingKM: "",
        totalKm: "",
        DieselAmount: "",
        DieselRate: "",
        dieselVolume: "",
        avgKmPerLtr: "",
        Narration: "",
      });
    }

    setDates(dateList);
  };

  const calculateTotals = () => {
    const totalKm = dates.reduce(
      (sum, item) => sum + (parseFloat(item.totalKm) || 0),
      0
    );
    const totalDieselAmount = dates.reduce(
      (sum, item) => sum + (parseFloat(item.DieselAmount) || 0),
      0
    );
    const totalDieselVolume = dates.reduce(
      (sum, item) => sum + (parseFloat(item.dieselVolume) || 0),
      0
    );
    const avgKmPerLtr =
      totalDieselVolume > 0 ? (totalKm / totalDieselVolume).toFixed(2) : 0;

    return { totalKm, totalDieselAmount, totalDieselVolume, avgKmPerLtr };
  };

  const handleSubmit = () => {
    const modifiedRowsArray = modifiedDates.map((item) => item.data);

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
    console.log(formData);
    addMonthlyLogService(formData)
      .then((res) => {
        if (res.data.ResponseStatus == 1) {
          setIsShow(true);
          setAlertType("success");
          setAlertMsg(res.data.ResponseMessage);
          setDates([]);
          setVehicleNumber("");
          setVehicleNumberId("");
          setSelectedMonth("");
          setSelectedYear("");
          setYearNumber(-1);
        } else {
          setIsShow(true);
          setAlertType("error");
          setAlertMsg(res.data.ResponseMessage);
        }
      })
      .catch((err) => {
        setIsShow(true);
        console.log("Error", err);
        alert("Error in submission");
      });
  };

  const totals = calculateTotals();

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  function handleGetVehicleNumberList(text) {
    const formData = new FormData();
    formData.append("VechileNo", text);
    formData.append("UserToken", "sdfsdf3355");
    formData.append("IP", "-1");
    formData.append("MAC", "ertetet");
    formData.append("GeoLocation", "20.25133,20.231464");
    formData.append("UserId", "25");

    getVehicleNumberListService(formData)
      .then((res) => {
        // console.log(res.data);
        setVehicleNumberList(res.data.result);
      })
      .catch((err) => console.log("Client List Error", err));
  }

  const debouncedGetVehicleNumberList = useCallback(
    debounce(handleGetVehicleNumberList, 500),
    []
  );

  const handleTextChange = (text) => {
    setVehicleNumber(text); // Update input immediately
    debouncedGetVehicleNumberList(text); // Debounce filtering
  };

  const handleSelect = (vehicle) => {
    setVehicleNumber(vehicle);
    setVehicleNumberList([]);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20, // Add padding to ensure the button is visible
        }}
      >
        <View style={{ padding: 30 }}>
          <View style={[styles.inputControl, { flexDirection: "row", gap: 5 }]}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.input}
                placeholder="Enter Vehicle No"
                value={vehicleNumber}
                onChangeText={handleTextChange}
              />
              {vehicleNumberList.length > 0 && (
                <View
                  style={{
                    position: "absolute", // Keep absolute if you want it to overlay
                    top: styles.input.height || 40, // Position below the TextInput (adjust height if needed)
                    left: 0,
                    right: 0,
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 5,
                    maxHeight: 200,
                    zIndex: 20,
                  }}
                >
                  <FlatList
                    data={vehicleNumberList}
                    keyExtractor={(item) => item?.id?.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setVehicleNumberId(item?.id);
                          handleSelect(item?.VechileNo);
                        }}
                        style={styles.dropdownItem}
                      >
                        <Text>{item?.VechileNo}</Text>
                      </TouchableOpacity>
                    )}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                    pointerEvents="auto"
                  />
                </View>
              )}
            </View>
            {/* <View style={[styles.pickerContainer]}>
              <Picker style={styles.picker} mode="dropdown">
                <Picker.Item label="Select Client" value="" />
                {clients?.map((item) => (
                  <Picker.Item
                    label={item.Branch}
                    value={item.M10_BankId}
                    key={item.M10_BankId}
                  />
                ))}
              </Picker>
            </View> */}
          </View>

          <View style={[styles.inputControl, { flexDirection: "row", gap: 5 }]}>
            <View style={[styles.pickerContainer, { flex: 1 }]}>
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
                  setSelectedYear(value.Year);
                  setYearNumber(value.Year);
                }}
                style={styles.picker}
                mode="dropdown"
              >
                <Picker.Item label="Year" value="" />
                {years?.map((item) => (
                  <Picker.Item
                    label={item.Year}
                    value={item}
                    key={item.YearId}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <CustomButton
            btnText={"Show"}
            onPress={isShowLogs ? getLogReportData : generateDates}
            style={{
              backgroundColor: "green",
              padding: 10,
              borderRadius: 10,
            }}
          />

          <ScrollView horizontal>
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
                  <Text style={[styles.cell, styles.headerCell]}>Total Km</Text>
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
                <View key={index} style={{ flexDirection: "row" }}>
                  <Text style={styles.cell}>{index + 1}</Text>
                  <Text style={styles.cell}>
                    {item?.LogDate || item?.CRDay1}
                  </Text>
                  <TextInput
                    style={styles.cellInput}
                    value={item.OpeningKM || item?.OpeningKm}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      handleInputChange(index, "OpeningKM", text)
                    }
                    readOnly={isShowLogs}
                    editable={!isShowLogs}
                  />
                  <TextInput
                    style={styles.cellInput}
                    value={item.ClosingKM || item?.ClosingKm}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      handleInputChange(index, "ClosingKM", text)
                    }
                    readOnly={isShowLogs}
                    editable={!isShowLogs}
                  />
                  <Text style={[styles.cell, { backgroundColor: "#e1ebff" }]}>
                    {item?.totalKm || item?.TotalKm}
                  </Text>
                  <TextInput
                    style={styles.cellInput}
                    value={item.DieselAmount || item?.Amount}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      handleInputChange(index, "DieselAmount", text)
                    }
                    readOnly={isShowLogs}
                    editable={!isShowLogs}
                  />
                  <TextInput
                    style={styles.cellInput}
                    value={item.DieselRate}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      handleInputChange(index, "DieselRate", text)
                    }
                    readOnly={isShowLogs}
                    editable={!isShowLogs}
                  />
                  <TextInput
                    style={styles.cellInput}
                    value={item.dieselVolume || item?.DieselQTYLTR}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      handleInputChange(index, "dieselVolume", text)
                    }
                    readOnly={isShowLogs}
                    editable={!isShowLogs}
                  />
                  <Text style={[styles.cell, { backgroundColor: "#e1ebff" }]}>
                    {item.avgKmPerLtr || item?.Average}
                  </Text>
                  <TextInput
                    style={styles.cellInput}
                    value={item.Narration}
                    onChangeText={(text) =>
                      handleInputChange(index, "Narration", text)
                    }
                    readOnly={isShowLogs}
                    editable={!isShowLogs}
                  />
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
                    {totals.totalKm}
                  </Text>
                  <Text style={[styles.cell, { fontWeight: "bold" }]}>
                    {totals.totalDieselAmount}
                  </Text>
                  <Text style={styles.cell}></Text>
                  <Text style={[styles.cell, { fontWeight: "bold" }]}>
                    {totals.totalDieselVolume}
                  </Text>
                  <Text style={[styles.cell, { fontWeight: "bold" }]}>
                    {totals.avgKmPerLtr}
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
                backgroundColor: "green",
                padding: 10,
                borderRadius: 10,
                marginTop: 20,
              }}
            />
          ) : null}
        </View>
      </ScrollView>
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
    marginBottom: 16,
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
    padding: 8,
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
    paddingHorizontal: 8,
    width: 110,
    height: 50,
    textAlign: "center",
  },

  headerText: {
    fontWeight: "bold",
    backgroundColor: "#f8f8f8",
  },
});

export default VehicleLog;
