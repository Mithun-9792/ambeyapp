import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native";
import CustomButton from "../components/CustomButton";
import {
  getClientListService,
  getMonthsListService,
  getYearsListService,
} from "../services/dashboard.services";

function VehicleLog() {
  const [clients, setClients] = useState([]);
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [dates, setDates] = useState([]);

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

  useEffect(() => {
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

    // Auto-calculate Total Km if Opening and Closing are filled
    if (field === "openingKm" || field === "closingKm") {
      const opening = parseFloat(updatedDates[index].openingKm) || 0;
      const closing = parseFloat(updatedDates[index].closingKm) || 0;
      updatedDates[index].totalKm =
        closing > 0 && opening > 0 ? (closing - opening).toString() : "";
    }

    // Auto-calculate Avg Km per Ltr if Diesel Volume > 0
    if (field === "totalKm" || field === "dieselVolume") {
      const totalKm = parseFloat(updatedDates[index].totalKm) || 0;
      const dieselVolume = parseFloat(updatedDates[index].dieselVolume) || 0;
      updatedDates[index].avgKmPerLtr =
        dieselVolume > 0 ? (totalKm / dieselVolume).toFixed(2) : "";
    }

    setDates(updatedDates);
  };

  const generateDates = () => {
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

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ margin: 30 }}>
          {/* Form Area */}
          <View
            style={[styles.inputControl, { flexDirection: "row", gap: 10 }]}
          >
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter Vehicle No"
            />
            <View style={[styles.pickerContainer]}>
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
            </View>
          </View>

          <View
            style={[styles.inputControl, { flexDirection: "row", gap: 10 }]}
          >
            <View style={[styles.pickerContainer, { flex: 1 }]}>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(value) => setSelectedMonth(value)}
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
                onValueChange={(value) => setSelectedYear(value)}
                style={styles.picker}
                mode="dropdown"
              >
                <Picker.Item label="Year" value="" />
                {years?.map((item) => (
                  <Picker.Item
                    label={item.Year}
                    value={item.Year}
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
              <View
                style={{ flexDirection: "row", backgroundColor: "#e1ebff" }}
              >
                <Text style={[styles.cell, styles.headerCell]}>S.No</Text>
                <Text style={[styles.cell, styles.headerCell]}>Date</Text>
                <Text style={[styles.cell, styles.headerCell]}>Opening Km</Text>
                <Text style={[styles.cell, styles.headerCell]}>Closing Km</Text>
                <Text style={[styles.cell, styles.headerCell]}>Total Km</Text>
                <Text style={[styles.cell, styles.headerCell]}>Diesel Amt</Text>
                <Text style={[styles.cell, styles.headerCell]}>
                  Diesel Rate
                </Text>
                <Text style={[styles.cell, styles.headerCell]}>Diesel Vol</Text>
                <Text style={[styles.cell, styles.headerCell]}>Avg Km/Ltr</Text>
                <Text style={[styles.cell, styles.headerCell]}>Narration</Text>
              </View>

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
            </View>
          </ScrollView>
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
