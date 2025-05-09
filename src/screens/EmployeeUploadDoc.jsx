import React, { useEffect, useState } from "react";
import {
  Alert,
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
  uploadEmpDocService,
} from "../services/auth.services";
import { useForm, Controller, set } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "../components/CustomAlert";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native";
import MyModal from "../components/CenterViewModal";
import { useRoute } from "@react-navigation/native";

const screenHeight = Dimensions.get("window").height;

const schema = yup.object().shape({
  VwDocID: yup.string().required("Select Doc type"),
  DocumentNo: yup.string().required("Enter Doc number"),
  DocExpiryDate: yup.string().required("Select Expiry date"),
  ImageUrlPath: yup.string().required("Select document image"),
});

function EmployeeUploadDoc() {
  const route = useRoute();
  const { userRegistrationId } = route.params;
  const [registrationId, setRegistrationId] = useState(
    userRegistrationId || ""
  );
  const [mobileNo, setMobileNo] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [docImage, setDocImage] = useState("");
  const [docType, setDocType] = useState([]);
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [expireDate, setExpireDate] = useState(new Date());
  const [imgPreview, setImgPreview] = useState("");
  const [userData, setUserData] = useState({});
  const [userDocs, setUserDocs] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

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
    if (userRegistrationId) {
      handleSearch();
    }
  }, []);

  const handleGetDoc = () => {
    const formData = new FormData();
    formData.append("RegisCode", registrationId);
    formData.append("MemberId", "-1");
    formData.append("DocTypeId", "-1");
    formData.append("UserToken", userData?.UserToken);
    formData.append("IP", "1032.021.026");
    formData.append("MAC", "FDDFDFG56456");
    formData.append("UserId", userData.UserId);
    formData.append("GeoLocation", "26.8467° N, 80.9462° E");

    getEmpDoc(formData)
      .then((res) => {
        console.log("doc", res.data?.result);
        setUserDocs(res.data?.result);
      })
      .catch((err) => {
        console.error("Error fetching employee document:", err);
      });
  };

  function handleSearch() {
    if (registrationId.length === 0 && mobileNo.length === 0) {
      setAlertType("info");
      setAlertMsg("Enter Registration No. or Mobile No.");
      setIsShow(true);
      return;
    }
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
        // console.log("Employee Details:", res.data);
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
    handleGetDoc();
  }

  const handleReset = () => {
    setRegistrationId("");
    setMobileNo("");
    setIsSearched(false);
    setEmployeeData([]);
    setUserDocs([]);
    setDocImage("");
    setImgPreview("");
    reset();
  };

  const launchCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setShowModal(result.canceled);
      setImgPreview(result.assets[0].uri);
      setDocImage(result.assets[0].base64);
      setValue("ImageUrlPath", result.assets[0].base64, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setShowModal(result.canceled);
      setImgPreview(result.assets[0].uri);
      setDocImage(result.assets[0].base64);
      setValue("ImageUrlPath", result.assets[0].base64, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const onSubmit = (data) => {
    console.log(data?.DocExpiryDate);
    const formData = new FormData();
    formData.append("M01_MemberID", employeeData[0]?.MemberID);
    formData.append("Regiscode", employeeData[0]?.RegistrationCode);
    formData.append("VwDocID", data?.VwDocID);
    formData.append("DocumentNo", data?.DocumentNo);
    formData.append("ImageUrlPath", docImage);
    formData.append("DocExpiryDate", data?.DocExpiryDate);
    formData.append("UserToken", userData?.UserToken);
    formData.append("IP", "324234234");
    formData.append("MAC", "sdfsd43523fgfsdg");
    formData.append("UserId", userData?.UserId);
    formData.append("GeoLocation", "26.8467° N, 80.9462° E");

    uploadEmpDocService(formData)
      .then((res) => {
        // console.log("Upload response:", res.data);
        if (res.data?.ResponseStatus == 1) {
          setAlertType("success");
          setAlertMsg(res?.data?.ResponseMessage);
          setIsShow(true);
          reset({
            VwDocID: "",
            DocumentNo: "",
            ExpiryDate: "",
          });
          setDocImage("");
          setImgPreview("");

          // Refresh document list
          handleGetDoc();
        } else {
          setAlertType("info");
          setAlertMsg(res?.data?.ResponseMessage);
          setIsShow(true);
        }
      })
      .catch((err) => {
        console.error("Error uploading document:", err);
      });
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
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ minHeight: screenHeight - 100 }}>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { width: 140 }]}
            placeholder="Registration ID"
            value={registrationId}
            onChangeText={setRegistrationId}
            readOnly={mobileNo.length > 0 || isSearched}
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
            readOnly={registrationId.length > 0 || isSearched}
          />
        </View>
        <CustomButton
          btnText={isSearched ? "Reset" : "Search"}
          style={[styles.btn, { marginTop: 5, marginBottom: 10 }]}
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
          <>
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontWeight: 600,
                marginTop: 10,
              }}
            >
              Upload Documents
            </Text>
            <View style={[styles.uploadSec]}>
              <View style={styles.inputControl}>
                <Text style={styles.inputLabel}>Select Document Type</Text>
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
                        <Picker.Item
                          label={"Select Document Type"}
                          value={""}
                        />
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
                {errors.VwDocID && (
                  <Text style={styles.error}>{errors.VwDocID.message}</Text>
                )}
              </View>
              <View style={styles.inputControl}>
                <Text style={styles.inputLabel}>Document No</Text>
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
                {errors.DocumentNo && (
                  <Text style={styles.error}>{errors.DocumentNo.message}</Text>
                )}
              </View>
              <View style={styles.inputControl}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <Controller
                  control={control}
                  name="ExpiryDate"
                  defaultValue={null}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TouchableOpacity
                        onPress={() => setShowExpiryPicker(true)}
                      >
                        <TextInput
                          style={styles.input}
                          placeholder="Select Expiry Date"
                          value={expireDate.toLocaleDateString("en-GB")}
                          editable={false}
                          pointerEvents="none"
                        />
                      </TouchableOpacity>

                      {showExpiryPicker && (
                        <DateTimePicker
                          value={expireDate}
                          mode="date"
                          display="default"
                          onChange={(event, selectedDate) => {
                            setShowExpiryPicker(false);
                            if (event.type === "set" && selectedDate) {
                              const currentDate = selectedDate;
                              setExpireDate(currentDate);
                              setValue(
                                "DocExpiryDate",
                                currentDate.toLocaleDateString("en-GB"),
                                {
                                  shouldValidate: true, // ✅ triggers validation
                                  shouldDirty: true, // ✅ marks it as user-edited
                                }
                              );
                            }
                          }}
                        />
                      )}
                    </>
                  )}
                />
                {errors.DocExpiryDate && (
                  <Text style={styles.error}>
                    {errors.DocExpiryDate.message}
                  </Text>
                )}
              </View>

              <View style={styles.inputControl}>
                <Text style={styles.inputLabel}>Document Image</Text>
                <View style={styles.imagePickerContainer}>
                  <TouchableOpacity onPress={() => setShowModal(true)}>
                    <View
                      style={[
                        styles.imagePlaceholder,
                        { height: imgPreview ? 200 : 50 },
                      ]}
                    >
                      {imgPreview ? (
                        <Image
                          source={{ uri: imgPreview }}
                          style={styles.image}
                        />
                      ) : (
                        <Text style={{ color: "gray", fontWeight: 500 }}>
                          Choose Doc Image
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
                {errors.ImageUrlPath && (
                  <Text style={styles.error}>
                    {errors.ImageUrlPath.message}
                  </Text>
                )}
              </View>
              <CustomButton
                btnText="Upload Document"
                style={[styles.btn]}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </>
        )}
        {userDocs.length > 0 && (
          <View>
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              Here is your uploaded documents
            </Text>
            {userDocs.map((item, index) => {
              return (
                <View
                  style={[styles.imagePickerContainer, { margin: 5 }]}
                  key={item?.MemberDocId}
                >
                  {/* {console.log(item)} */}
                  <Text
                    style={{
                      color: "gray",
                      fontWeight: 500,
                      marginLeft: "5%",
                      fontSize: 16,
                    }}
                  >
                    {item?.DocType}
                  </Text>
                  <View style={[styles.imagePlaceholder, { height: 200 }]}>
                    <Image
                      source={{ uri: item?.AndriodPhotoPath2 }}
                      style={[styles.image, { padding: 5 }]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
      <CustomAlert
        visible={isShow}
        message={alertMsg}
        type={alertType}
        setVisible={setIsShow}
      />
      <MyModal
        modalVisible={showModal}
        setModalVisible={setShowModal}
        action1={launchCamera}
        action2={pickImage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    // flex: 1,
    flexDirection: "row",
    // alignItems: "center",
    padding: 10,
    gap: 5,
    justifyContent: "space-between",
    // paddingHorizontal: 20,
  },
  uploadSec: {
    flex: 1,
    padding: 20,
    marginVertical: 10,
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
