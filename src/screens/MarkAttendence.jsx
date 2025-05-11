import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  Button,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { Picker } from "@react-native-picker/picker";
import { COLORS } from "../constants/colors";
import CustomButton from "../components/CustomButton";
import { TouchableOpacity } from "react-native";
import { size } from "lodash";

const attendanceData = [
  {
    id: "1",
    code: "TEMP2828",
    name: "Dinesh",
    mobile: "9792518649",
    designation: "R.M",
  },
  {
    id: "2",
    code: "TEMP2829",
    name: "Dileep",
    mobile: "2211334455",
    designation: "Loader",
  },
  {
    id: "3",
    code: "TEMP2830",
    name: "Rahul",
    mobile: "8899889999",
    designation: "Driver",
  },
  {
    id: "4",
    code: "TEMP2831",
    name: "Virat",
    mobile: "1122334433",
    designation: "Driver",
  },
  {
    id: "5",
    code: "TEMP2832",
    name: "Mithun Pal",
    mobile: "8896748255",
    designation: "Driver",
  },
  {
    id: "6",
    code: "TEMP2834",
    name: "Yogendra",
    mobile: "333355553333",
    designation: "Gun Man",
  },
  {
    id: "7",
    code: "TEMP2835",
    name: "Test New User",
    mobile: "8899009009",
    designation: "Account Manager",
  },
  {
    id: "8",
    code: "TEMP2836",
    name: "New User",
    mobile: "9988889990",
    designation: "Gun Man",
  },
  {
    id: "9",
    code: "TEMP2837",
    name: "New User",
    mobile: "9988889990",
    designation: "Mentainer",
  },
  {
    id: "10",
    code: "TEMP2838",
    name: "New User",
    mobile: "9988889990",
    designation: "Mentainer",
  },
  {
    id: "11",
    code: "TEMP2839",
    name: "New User",
    mobile: "9988889990",
    designation: "Mentainer",
  },
  {
    id: "12",
    code: "TEMP2840",
    name: "New User",
    mobile: "9988889990",
    designation: "Mentainer",
  },
  {
    id: "13",
    code: "TEMP2841",
    name: "New User",
    mobile: "9988889990",
    designation: "Mentainer",
  },
  {
    id: "14",
    code: "TEMP2842",
    name: "New User",
    mobile: "9988889990",
    designation: "Mentainer",
  },
  {
    id: "15",
    code: "TEMP2843",
    name: "New User",
    mobile: "9988889990",
    designation: "Mentainer",
  },
];

const MarkAttendence = () => {
  const [data, setData] = useState(
    attendanceData.map((item) => ({
      ...item,
      status: "Present",
      leaveType: "",
      remark: "",
    }))
  );

  const handleUpdate = (index, key, value) => {
    const newData = [...data];
    newData[index][key] = value;
    setData(newData);
  };

  const renderItem = ({ item, index }) => (
    <ScrollView horizontal>
      <View style={styles.row}>
        <Text style={styles.cell}>{index + 1}</Text>
        <Text style={styles.cell}>{item.code}</Text>
        <Text style={styles.cell}>{item.name}</Text>
        <Text style={styles.cell}>{item.mobile}</Text>
        <Text style={styles.cell}>{item.designation}</Text>

        <View style={styles.cell}>
          <RadioButtonGroup
            containerStyle={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
            }}
            selected={item.status}
            onSelected={(value) => handleUpdate(index, "status", value)}
            radioBackground={COLORS.primary}
            size={18}
            radioStyle={{ borderRadius: "50%", size: 18 }}
          >
            <RadioButtonItem value="Present" label="Present" />
            <RadioButtonItem value="Absent" label="Absent" />
          </RadioButtonGroup>
        </View>
        <View
          style={[
            styles.cell,
            { width: 150, paddingVertical: 0, paddingHorizontal: 0 },
          ]}
        >
          <Picker
            selectedValue={item.leaveType}
            onValueChange={(value) => handleUpdate(index, "leaveType", value)}
            style={[styles.picker]}
            itemStyle={{ fontSize: 14 }}
            dropdownIconColor={COLORS.primary}
          >
            <Picker.Item label="Type" value="" />
            <Picker.Item label="Sick Leave" value="Sick" />
            <Picker.Item label="Casual Leave" value="Casual" />
            <Picker.Item label="Paid Leave" value="Paid" />
          </Picker>
        </View>
        <View
          style={[
            styles.cell,
            { alignContent: "center", paddingHorizontal: 4 },
          ]}
        >
          <TextInput
            style={[styles.input]}
            value={item.remark}
            onChangeText={(text) => handleUpdate(index, "remark", text)}
            placeholder="Remark"
          />
        </View>
        <View
          style={[
            styles.cell,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <TouchableOpacity
            style={[styles.btn]}
            onPress={() => console.log("Saved:", item)}
          >
            <Text style={{ color: COLORS.primary }}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <ScrollView>
      <ScrollView horizontal>
        <View>
          <View style={styles.header}>
            <Text style={[styles.headerCell, styles.cell]}>Sr.No</Text>
            <Text style={[styles.headerCell, styles.cell]}>Reg Code</Text>
            <Text style={[styles.headerCell, styles.cell]}>Name</Text>
            <Text style={[styles.headerCell, styles.cell]}>Mobile</Text>
            <Text style={[styles.headerCell, styles.cell]}>Designation</Text>
            <Text style={[styles.headerCell, styles.cell]}>Status</Text>
            <Text style={[styles.headerCell, styles.cell, { width: 150 }]}>
              Leave Type
            </Text>
            <Text style={[styles.headerCell, styles.cell]}>Remark</Text>
            <Text style={[styles.headerCell, styles.cell]}>Action</Text>
          </View>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    backgroundColor: "#eee",
    // padding: 5,
  },
  row: {
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
    height: 60,
    textAlign: "center",
    textAlignVertical: "center",
  },
  picker: {
    height: 58,
    backgroundColor: COLORS.secondary,
    fontSize: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    padding: 5,
    borderColor: "#ccc",
    textAlign: "center",
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

export default MarkAttendence;
