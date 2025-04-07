import React, { useState } from "react";
import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";

function EmployeeUploadDoc() {
  const [registrationId, setRegistrationId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = () => {
    // Your search logic here
    console.log("Registration ID:", registrationId);
    console.log("Mobile No:", mobileNo);
    setIsSearched(true);
  };

  const handleReset = () => {
    setRegistrationId("");
    setMobileNo("");
    setIsSearched(false);
  };

  const employeeData = [
    {
      srNo: 1,
      registrationCode: "00242",
      firstName: "Prabhunath",
      lastName: "Yadav",
      dlNo: "",
      dlExpiry: "01/01/1900",
      email: "",
      mobileNo: "9839965140",
      //   address:
      //     "22-Mahuibandh, Salamatpur, Bahadurgaj, Jakhanian, Ghazipur, Uttar Pradesh - 275201",
      pincode: "275101",
      location: "MAU",
      bank: "PNB",
      vehicle: "CASH VAN",
    },
    // Add more rows here if needed
  ];

  const renderItem = ({ item }) => (
    <View style={styles.Tablerow}>
      <Text style={styles.cell}>{item.srNo}</Text>
      <Text style={styles.cell}>{item.registrationCode}</Text>
      <Text style={styles.cell}>{item.firstName}</Text>
      <Text style={styles.cell}>{item.lastName}</Text>
      <Text style={styles.cell}>{item.dlNo}</Text>
      <Text style={styles.cell}>{item.dlExpiry}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.mobileNo}</Text>
      {/* <Text style={[styles.cell, { flex: 2 }]}>{item.address}</Text> */}
      <Text style={styles.cell}>{item.pincode}</Text>
      <Text style={styles.cell}>{item.location}</Text>
      <Text style={styles.cell}>{item.bank}</Text>
      <Text style={styles.cell}>{item.vehicle}</Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: "green" }]}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: "#b43b3b" }]}>
        <Text style={styles.buttonText}>View/Update</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { width: 140 }]}
          placeholder="Registration ID"
          value={registrationId}
          onChangeText={setRegistrationId}
          readOnly={mobileNo.length > 0 || isSearched}
        />
        <TextInput
          style={[styles.input, { width: 100, marginLeft: 8 }]}
          placeholder="Mobile No"
          value={mobileNo}
          onChangeText={setMobileNo}
          keyboardType="phone-pad"
          readOnly={registrationId.length > 0 || isSearched}
        />
        <CustomButton
          btnText={isSearched ? "Reset" : "Search"}
          style={[styles.btn, { marginLeft: 8, paddingHorizontal: 10 }]}
          onPress={isSearched ? handleReset : handleSearch}
        />
      </View>
      <ScrollView horizontal>
        <View>
          {/* Table Header */}
          <View style={[styles.Tablerow, { backgroundColor: "#eee" }]}>
            {[
              "Sr. No",
              "Registration Code",
              "FirstName",
              "LastName",
              "DL No.",
              "DL Expiry Date",
              "E-Mail",
              "MobileNo",
              //   "Address",
              "Pincode",
              "Working Location",
              "Working Bank Name",
              "Vehicle Type",
              "Edit",
              "View/Update Document",
            ].map((heading, idx) => (
              <Text key={idx} style={[styles.cell, styles.headerCell]}>
                {heading}
              </Text>
            ))}
          </View>

          {/* Table Rows */}
          <FlatList
            data={employeeData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 5,
    justifyContent: "space-between",
    // paddingHorizontal: 20,
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
  Tablerow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    alignItems: "center",
  },
  cell: {
    minWidth: 120,
    paddingHorizontal: 5,
    color: "#333",
    textAlign: "center",
  },
  headerCell: {
    fontWeight: "bold",
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderRadius: 4,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default EmployeeUploadDoc;
