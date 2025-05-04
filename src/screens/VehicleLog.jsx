import { Picker } from "@react-native-picker/picker";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
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
  getYearsListService,
} from "../services/dashboard.services";
import { set } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";

function VehicleLog() {
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
  const [lastEditedRowIndex, setLastEditedRowIndex] = useState(null);
  const [userData, setUserData] = useState({});
  const [tableData, setTableData] = useState(
    Array(10).fill({
      date: "",
      openingKm: "",
      closingKm: "",
      totalKm: "",
      dieselAmount: "",
      dieselRate: "",
      dieselVolume: "",
      avgKmPerLtr: "",
      narration: "",
    })
  );

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

  const handleInputChange = (index, field, value) => {
    const updatedDates = [...dates];
    updatedDates[index][field] = value;

    // Track the last edited row index
    setLastEditedRowIndex(index);

    // Auto-calculate Total Km if Opening and Closing are filled
    if (field === "openingKm" || field === "closingKm") {
      const opening = parseFloat(updatedDates[index].openingKm) || 0;
      const closing = parseFloat(updatedDates[index].closingKm) || 0;
      updatedDates[index].totalKm =
        closing > 0 && opening > 0 ? (closing - opening).toString() : "";
    }

    // Auto-calculate Avg Km per Ltr if Diesel Volume > 0
    if (field === "dieselAmount" || field === "dieselRate") {
      const dieselAmount = parseFloat(updatedDates[index].dieselAmount) || 0;
      const dieselRate = parseFloat(updatedDates[index].dieselRate) || 0;
      updatedDates[index].dieselVolume =
        dieselRate > 0 ? (dieselAmount / dieselRate).toFixed(2) : "";
    }

    if (
      field === "totalKm" ||
      field === "dieselVolume" ||
      field === "dieselAmount" ||
      field === "dieselRate"
    ) {
      const totalKm = parseFloat(updatedDates[index].totalKm) || 0;
      const dieselVolume = parseFloat(updatedDates[index].dieselVolume) || 0;
      updatedDates[index].avgKmPerLtr =
        dieselVolume > 0 ? (totalKm / dieselVolume).toFixed(2) : "";
    }

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
        date: formattedDate,
        openingKm: "",
        closingKm: "",
        totalKm: "",
        dieselAmount: "",
        dieselRate: "",
        dieselVolume: "",
        avgKmPerLtr: "",
        narration: "",
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
      (sum, item) => sum + (parseFloat(item.dieselAmount) || 0),
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
    const totals = calculateTotals();
    if (lastEditedRowIndex !== null) {
      console.log("Last Edited Row Data:", dates[lastEditedRowIndex]);
    }
    // console.log("Submitted Data:", dates);
    // console.log("Totals:", totals, vehicleNumberId, vehicleNumber);
    // alert("Data submitted successfully!");
    const formData = new FormData();
    formData.append("MonthNmber", parseInt(selectedMonth) || 1);
    formData.append("YearNumber", parseInt(yearNumber) || "");
    formData.append("OpeningKM", dates[lastEditedRowIndex]?.openingKm || "");
    formData.append("ClosingKM", dates[lastEditedRowIndex]?.closingKm || "");
    formData.append(
      "DieselAmount",
      dates[lastEditedRowIndex]?.dieselAmount || ""
    );
    formData.append("DieselRate", dates[lastEditedRowIndex]?.dieselRate || "");
    formData.append("Narration", dates[lastEditedRowIndex]?.narration || "");
    formData.append("TotalKM", dates[lastEditedRowIndex]?.totalKm || "");
    formData.append("LogDate", dates[lastEditedRowIndex]?.date || "");
    formData.append("LogListData", JSON.stringify(dates));
    formData.append("VenderVehicleId", vehicleNumberId || 21);
    formData.append("VechileRegisNo", vehicleNumber || "");
    formData.append("UserToken", userData?.UserToken);
    formData.append("IP", "1032.021.026");
    formData.append("MAC", "FDDFDFG56456");
    formData.append("UserId", userData.UserId);
    formData.append("GeoLocation", "26.8467° N, 80.9462° E");

    addMonthlyLogService(formData)
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 1) {
          alert("Data submitted successfully!");
        }
      })
      .catch((err) => {
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
    <SafeAreaView>
      <ScrollView>
        <View style={{ margin: 30 }}>
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
                  setYearNumber(value.YearId);
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
            onPress={generateDates}
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
                  <Text style={styles.cell}>{item.date}</Text>
                  <TextInput
                    style={styles.cellInput}
                    value={item.openingKm}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      handleInputChange(index, "openingKm", text)
                    }
                  />
                  <TextInput
                    style={styles.cellInput}
                    value={item.closingKm}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      handleInputChange(index, "closingKm", text)
                    }
                  />
                  <Text style={[styles.cell, { backgroundColor: "#e1ebff" }]}>
                    {item.totalKm}
                  </Text>
                  <TextInput
                    style={styles.cellInput}
                    value={item.dieselAmount}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      handleInputChange(index, "dieselAmount", text)
                    }
                  />
                  <TextInput
                    style={styles.cellInput}
                    value={item.dieselRate}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      handleInputChange(index, "dieselRate", text)
                    }
                  />
                  <TextInput
                    style={styles.cellInput}
                    value={item.dieselVolume}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      handleInputChange(index, "dieselVolume", text)
                    }
                  />
                  <Text style={[styles.cell, { backgroundColor: "#e1ebff" }]}>
                    {item.avgKmPerLtr}
                  </Text>
                  <TextInput
                    style={styles.cellInput}
                    value={item.narration}
                    onChangeText={(text) =>
                      handleInputChange(index, "narration", text)
                    }
                  />
                </View>
              ))}

              {/* Totals Row */}
              {dates.length ? (
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

          {dates.length ? (
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
    </SafeAreaView>
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
