import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import {
  getDocType,
  getEmpDoc,
  getEmployeeDetail,
} from "../services/auth.services";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const schema = yup.object().shape({
  VwDocID: yup.string(),
  DocumentNo: yup.string(),
  ImageUrlPath: yup.string(),
});

function EmployeeUploadDoc() {
  const [registrationId, setRegistrationId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [docImage, setDocImage] = useState("");
  const [docType, setDocType] = useState([]);
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [imgPreview, setImgPreview] = useState("");
  const [userData, setUserData] = useState({});

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
    const formData = new FormData();
    formData.append("DocumentTypeId", "-1");
    formData.append("Status", "Z");
    formData.append("UserToken", "");
    formData.append("IP", "");
    formData.append("MAC", "");
    formData.append("UserId", "");
    formData.append("GeoLocation", "");

    getDocType(formData)
      .then((res) => {
        setDocType(res.data?.result);
      })
      .catch((err) => {
        console.error("Error fetching document types:", err);
      });
    getUserData();
  }, []);

  const handleGetDoc = (data) => {
    getEmpDoc(data)
      .then((res) => {
        console.log(res.data?.result);
      })
      .catch((err) => {
        console.error("Error fetching employee document:", err);
      });
  };

  const handleSearch = () => {
    // Your search logic here
    console.log("Registration ID:", registrationId);
    console.log("Mobile No:", mobileNo);
    setIsSearched(true);
    const formData = new FormData();
    formData.append("MemberID", "-1");
    formData.append("Name", "");
    formData.append("RegCode", registrationId);
    formData.append("MobileNo", mobileNo);
    formData.append("Status", "Z");
    formData.append("M32_DepartmentId", "-1");
    formData.append("M14_DesignationID", "-1");
    formData.append("M33_LocationId", "-1");
    formData.append("StaffTypeCode", "");
    formData.append("UserToken", userData?.UserToken || "");
    formData.append("UserId", userData.UserId || "");
    formData.append("IP", "");
    formData.append("MAC", "");
    formData.append("DocTypeId", "-1");
    formData.append("GeoLocation", "56.225551,58.5646");

    getEmployeeDetail(formData)
      .then((res) => {
        console.log("Employee Details:", res.data.result);
        setEmployeeData(res.data.result);
        handleGetDoc(formData);
      })
      .catch((err) => {
        console.error("Error fetching employee details:", err);
      });
  };

  const handleReset = () => {
    setRegistrationId("");
    setMobileNo("");
    setIsSearched(false);
  };

  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImgPreview(result.assets[0].uri);
      setImage(result.assets[0].base64);
    }
  };

  const onSubmit = (data) => {
    data.ImageUrlPath = docImage;
    console.log(data);
  };

  const renderItem = ({ item }) => (
    <View style={styles.Tablerow}>
      <Text style={styles.cell}>{item.RegistrationCode}</Text>
      <Text style={styles.cell}>{item.Name}</Text>
      <Text style={styles.cell}>{item.MobileNo}</Text>
      {/* <TouchableOpacity style={[styles.button, { backgroundColor: "green" }]}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: "#b43b3b" }]}>
        <Text style={styles.buttonText}>View/Update</Text>
      </TouchableOpacity> */}
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
          style={[styles.input, { width: 140, marginLeft: 8 }]}
          placeholder="Mobile No"
          value={mobileNo}
          onChangeText={setMobileNo}
          keyboardType="phone-pad"
          readOnly={registrationId.length > 0 || isSearched}
        />
      </View>
      <CustomButton
        btnText={isSearched ? "Reset" : "Search"}
        style={[styles.btn, { marginLeft: 8, paddingHorizontal: 10 }]}
        onPress={isSearched ? handleReset : handleSearch}
      />
      <ScrollView horizontal>
        <View>
          {/* Table Header */}
          <View style={[styles.Tablerow, { backgroundColor: "#eee" }]}>
            {[
              "Registration Code",
              "Name",
              "MobileNo",
              // "Edit",
              // "View/Update Document",
            ].map((heading, idx) => (
              <Text key={idx} style={[styles.cell, styles.headerCell]}>
                {heading}
              </Text>
            ))}
          </View>

          <FlatList
            data={employeeData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>
      {employeeData.length > 0 && (
        <View style={[styles.uploadSec]}>
          <View style={styles.inputControl}>
            <Text style={styles.inputLabel}>Select City</Text>
            <View style={styles.pickerContainer}>
              <Controller
                control={control}
                name="VwDocID"
                render={({ field: { onChange, value } }) => (
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}
                    mode="dropdown"
                  >
                    <Picker.Item label={"Select Document Type"} value={""} />
                    {docType &&
                      docType.map((item) => {
                        return (
                          <Picker.Item
                            label={item?.DocumentType}
                            value={item?.DocTypeId}
                            key={item?.DocTypeId}
                          />
                        );
                      })}
                  </Picker>
                )}
              />
            </View>
          </View>
          <View style={styles.inputControl}>
            <Text style={styles.inputLabel}>Nominee Aadhar No</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Enter Document No"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="DocumentNo"
            />
          </View>
          <View style={styles.inputControl}>
            <Text style={styles.inputLabel}>Expiry Date</Text>
            <Controller
              control={control}
              name="ExpiryDate"
              defaultValue={null}
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity onPress={() => setShowExpiryPicker(true)}>
                    <TextInput
                      style={styles.input}
                      placeholder="Select Expiry Date"
                      value={value}
                      editable={false}
                      pointerEvents="none"
                    />
                  </TouchableOpacity>

                  {showExpiryPicker && (
                    <DateTimePicker
                      value={value ? new Date(value) : new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowExpiryPicker(false);
                        if (event.type === "set" && selectedDate) {
                          onChange(selectedDate.toLocaleDateString()); // store as ISO
                        }
                      }}
                    />
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.inputControl}>
            <Text style={styles.inputLabel}>Profile Image</Text>
            <View style={styles.imagePickerContainer}>
              <TouchableOpacity onPress={() => pickImage(setDocImage)}>
                <View
                  style={[
                    styles.imagePlaceholder,
                    { height: imgPreview ? 200 : 50 },
                  ]}
                >
                  {imgPreview ? (
                    <Image source={{ uri: imgPreview }} style={styles.image} />
                  ) : (
                    <Text style={{ color: "gray", fontWeight: 500 }}>
                      Choose Profile Image
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <CustomButton
            btnText="Upload Document"
            style={[styles.btn]}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      )}
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
  uploadSec: {
    flex: 1,
    padding: 20,
    marginVertical: 20,
    width: "100%",
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

  inputControl: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  // input: {
  //   height: 50,
  //   backgroundColor: "#fff",
  //   paddingHorizontal: 16,
  //   borderRadius: 12,
  //   fontSize: 15,
  //   fontWeight: "500",
  //   color: "#222",
  //   borderWidth: 1,
  //   borderColor: "#C9D3DB",
  //   borderStyle: "solid",
  // },
  error: {
    color: "red",
    marginBottom: 10,
  },
  imagePickerContainer: {
    // alignItems: "center",
    // marginBottom: 20,
  },
  imagePlaceholder: {
    // height: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "gray",
    borderWidth: 1,
    borderColor: "#C9D3DB",
    borderStyle: "solid",
    flex: 1,
    justifyContent: "center",
    alignItems: "start",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pickerContainer: {
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
    flex: 1,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    height: 60,
    width: "100%",
    color: "#222",
  },
});

export default EmployeeUploadDoc;
