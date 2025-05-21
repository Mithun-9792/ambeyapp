import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  Button,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { Picker } from "@react-native-picker/picker";
import { COLORS } from "../constants/colors";
import { TouchableOpacity } from "react-native";
import useToaster from "../hooks/useToaster";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableWithoutFeedback } from "react-native";
import { Keyboard } from "react-native";
import {
  getLeaveTypeListService,
  getUserListService,
  lockAttendenceService,
} from "../services/dashboard.services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/CustomButton";

const MarkAttendence = () => {
  const { showAlert, AlertView } = useToaster();
  const [userData, setUserData] = useState({});
  const [data, setData] = useState();
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [LeaveTypeName, setLeaveTypeName] = useState("");

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

  const handleGetUserList = () => {
    const formData = new FormData();
    formData.append("RegCode", "");
    formData.append("MobileNo", "");
    formData.append("UserToken", userData?.UserToken || "");
    formData.append("IP", "102.253.658.20");
    formData.append("MAC", "MAC24323423");
    formData.append("UserId", userData.UserId || 15);
    formData.append("GeoLocation", "25.251452,36.25478");

    getUserListService(formData)
      .then((res) => {
        // console.log(res.data);
        setData(
          res.data.result?.map((item) => ({
            ...item,
            IsPresent: "true",
            leaveType: "",
            remark: "",
          }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
    getLevesType(formData);
  };

  const getLevesType = (formdata) => {
    getLeaveTypeListService(formdata)
      .then((res) => {
        // console.log(res.data);
        setLeaveTypes(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUserData();
    handleGetUserList();
  }, []);

  const handleUpdate = (index, key, value) => {
    const newData = [...data];
    newData[index][key] = value;
    setData(newData);
  };

  const handleMarkAttendence = (attendeceData) => {
    // console.log(attendeceData);
    const formData = new FormData();
    formData.append(
      "ListData",
      JSON.stringify([
        {
          MemberId: attendeceData.MemberID,
          Date: new Date(),
          IsPresent: attendeceData.IsPresent,
          LeaveTypeId: attendeceData.leaveType,
          LeaveTypeName: LeaveTypeName,
          Remark: attendeceData.remark,
        },
      ])
    );

    formData.append("UserToken", userData?.UserToken || "");
    formData.append("IP", "1025.125.2156.23");
    formData.append("MAC", "56546DF345345");
    formData.append("UserId", "15");
    formData.append("GeoLocation", "12.26565,15.544564");
    handleAttendece(formData);
  };

  const handleMarkAllAttendence = () => {
    if (!data || data.length === 0) {
      showAlert("No data to mark attendance.", "info");
      return;
    }

    // Validate all required fields
    for (let item of data) {
      if (item.IsPresent === "false" && !item.leaveType) {
        showAlert(`Please select a leave type for ${item.Name}.`, "info");
        return;
      }
    }

    // Prepare the list
    const listData = data.map((attendeceData) => {
      const leaveTypeObj = leaveTypes.find(
        (lt) => lt.LeaveTypeId === attendeceData.leaveType
      );
      return {
        MemberId: attendeceData.MemberID,
        Date: new Date(),
        IsPresent: attendeceData.IsPresent,
        LeaveTypeId: attendeceData.leaveType,
        LeaveTypeName: leaveTypeObj ? leaveTypeObj.LeaveTypeName : "",
        Remark: attendeceData.remark,
      };
    });

    const formData = new FormData();
    formData.append("ListData", JSON.stringify(listData));
    formData.append("UserToken", userData?.UserToken || "");
    formData.append("IP", "1025.125.2156.23");
    formData.append("MAC", "56546DF345345");
    formData.append("UserId", "15");
    formData.append("GeoLocation", "12.26565,15.544564");
    handleAttendece(formData);
  };

  function handleAttendece(formdata) {
    lockAttendenceService(formdata)
      .then((res) => {
        if (res.data.ResponseStatus == 1) {
          showAlert(res.data?.ResponseMessage, "success");
        } else {
          showAlert(res.data?.ResponseMessage, "error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const renderItem = ({ item, index }) => (
    <ScrollView horizontal>
      <View style={styles.row}>
        <Text style={styles.cell}>{index + 1}</Text>
        <Text style={styles.cell}>{item.RegistrationCode}</Text>
        <Text style={styles.cell}>{item.Name}</Text>
        {/* <Text style={styles.cell}>{item.mobile}</Text> */}
        <Text style={styles.cell}>{item.Designation}</Text>
        <Text style={styles.cell}>{new Date().toLocaleDateString()}</Text>

        <View style={styles.cell}>
          <RadioButtonGroup
            containerStyle={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
            }}
            selected={item.IsPresent}
            onSelected={(value) => handleUpdate(index, "IsPresent", value)}
            radioBackground={COLORS.primary}
            size={18}
            radioStyle={{ borderRadius: "50%", size: 18 }}
          >
            <RadioButtonItem value="true" label="Present" />
            <RadioButtonItem value="false" label="Absent" />
          </RadioButtonGroup>
        </View>
        <View
          style={[
            styles.cell,
            { width: 150, paddingVertical: 0, paddingHorizontal: 0 },
          ]}
        >
          <Picker
            selectedValue={item.leaveType} // Ensure this matches the value of Picker.Item
            onValueChange={(value) => {
              handleUpdate(index, "leaveType", value); // Set the leaveType to the selected value
              const selectedLeaveType = leaveTypes.find(
                (leaveType) => leaveType.LeaveTypeId === value
              );
              setLeaveTypeName(selectedLeaveType?.LeaveTypeName || ""); // Update LeaveTypeName
            }}
            style={[styles.picker]}
            itemStyle={{ fontSize: 14 }}
            dropdownIconColor={COLORS.primary}
          >
            <Picker.Item label="Type" value="" />
            {leaveTypes.map((leaveType) => (
              <Picker.Item
                label={leaveType?.LeaveTypeName}
                value={leaveType.LeaveTypeId} // Use LeaveTypeId as the value
                key={leaveType.LeaveTypeId}
              />
            ))}
          </Picker>
        </View>
        <View style={[styles.cell, { paddingHorizontal: 4 }]}>
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
            onPress={() => {
              if (item.IsPresent === "false" && !item.leaveType) {
                showAlert("Please select a leave type.", "info");
              } else {
                handleMarkAttendence(item);
              }
            }}
          >
            <Text style={{ color: COLORS.primary }}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        extraScrollHeight={80}
        enableOnAndroid={true}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <CustomButton
              btnText={"Mark All Attendence"}
              onPress={() => handleMarkAllAttendence()}
              style={{
                backgroundColor: COLORS.secondary,
                paddingVertical: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: COLORS.primary,
              }}
            />
            <ScrollView horizontal>
              <View style={{ flex: 1, padding: 30 }}>
                <View style={styles.header}>
                  <Text style={[styles.headerCell, styles.cell]}>Sr.No</Text>
                  <Text style={[styles.headerCell, styles.cell]}>Reg Code</Text>
                  <Text style={[styles.headerCell, styles.cell]}>Name</Text>
                  {/* <Text style={[styles.headerCell, styles.cell]}>Mobile</Text> */}
                  <Text style={[styles.headerCell, styles.cell]}>
                    Designation
                  </Text>
                  <Text style={[styles.headerCell, styles.cell]}>Date</Text>
                  <Text style={[styles.headerCell, styles.cell]}>Status</Text>
                  <Text
                    style={[styles.headerCell, styles.cell, { width: 150 }]}
                  >
                    Leave Type
                  </Text>
                  <Text style={[styles.headerCell, styles.cell]}>Remark</Text>
                  <Text style={[styles.headerCell, styles.cell]}>Action</Text>
                </View>
                <FlatList
                  data={data}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.RegistrationCode}
                  ListEmptyComponent={
                    !data ? (
                      <View style={styles.loaderContainer}>
                        <ActivityIndicator
                          color={COLORS.primary}
                          size={"large"}
                        />
                      </View>
                    ) : (
                      <View style={styles.loaderContainer}>
                        <Text style={{ color: COLORS.primary }}>
                          No Data Found
                        </Text>
                      </View>
                    )
                  }
                />
              </View>
            </ScrollView>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
      <AlertView />
    </View>
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MarkAttendence;
