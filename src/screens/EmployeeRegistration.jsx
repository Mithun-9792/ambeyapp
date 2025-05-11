import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Text } from "react-native";
import { ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import CustomButton from "../components/CustomButton";
import { Picker } from "@react-native-picker/picker";
import {
  getCityService,
  getDepartmentService,
  getDesignationService,
  getLocationsService,
  getNomineeRelationService,
  getStateService,
  getTitleService,
  registerService,
} from "../services/auth.services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyModal from "../components/CenterViewModal";
import { useRoute } from "@react-navigation/native";
import CustomAlert from "../components/CustomAlert";
import Checkbox from "expo-checkbox";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { COLORS } from "../constants/colors";
import useToaster from "../hooks/useToaster";

const schema = yup.object().shape({
  DateofJoining: yup.date().required("Date of Joining is required"),
  Dateofbirth: yup.date().required("Date of Birth is required"),
  RegistrationCode: yup.string(),
  TitleId: yup.number().required("Please Select title"),
  FullName: yup.string().required("Please enter you full name"),
  EMail: yup.string().email("Please enter a valid email address"),
  // .required("Please enter your email"),
  MobileNo: yup.number().required("Please enter mobile number"),
  AlternateMob: yup.number(),
  FatherHusbandName: yup
    .string()
    .required("Father or husband name is required"),
  DesignationId: yup.number().required("Please select designation"),
  LocationId: yup.number().required("Please select location"),
  StaffTypeCode: yup.string().required("Please select type"),
  DepartmentId: yup.number().required("Please select department"),
  Gender: yup.string().required("Please select gender"),
  Address: yup.string(),
  PermanentAddress: yup.string(),
});

function EmployeeRegistration() {
  const { showAlert, AlertView } = useToaster();
  const route = useRoute();
  const { isNew, employeeData } = route.params;
  console.log(employeeData, "employee data");
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      DateofJoining: new Date(),
      Dateofbirth: eighteenYearsAgo,
      RegistrationCode: "",
      AlternateMob: 0,
    },
  });

  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [relations, setRelations] = useState([]);
  const [title, setTitle] = useState([]);
  const [picPreview, setPicPreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [date, setDate] = useState(new Date());
  const [dob, setDob] = useState(eighteenYearsAgo);
  const [show, setShow] = useState(false);
  const [showDob, setShowDob] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [isSameAddress, setIsSameAddress] = useState(false);

  useEffect(() => {
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey && errors[firstErrorKey]?.message) {
      showAlert(errors[firstErrorKey].message, "error");
    }
  }, [errors]);

  function dateFormat(date) {
    const [day, month, year] = date.split("/");
    dateValue = new Date(`${year}-${month}-${day}`);
    return dateValue;
  }

  useEffect(() => {
    if (employeeData) {
      setValue("RegistrationCode", employeeData.RegistrationCode || "");
      setValue("TitleId", parseInt(employeeData.Title) || "");
      setValue("FullName", employeeData.Name?.trim() || "");
      setValue("EMail", employeeData.EMail || "");
      setValue("MobileNo", employeeData.MobileNo || "");
      setValue("AlternateMob", employeeData.AlternateMob || "");
      setValue("FatherHusbandName", employeeData.HFName || "");
      setValue("DesignationId", parseInt(employeeData.DesignationID) || "");
      setValue("LocationId", parseInt(employeeData.LocationId) || "");
      setValue("StaffTypeCode", employeeData.StaffTypeCode || "");
      setValue("DepartmentId", parseInt(employeeData.DepartmentId) || "");
      setValue("Gender", employeeData.Gender || "");
      setValue("DateofJoining", new Date(dateFormat(employeeData.DOJ)));
      setValue("Dateofbirth", new Date(dateFormat(employeeData.DOB)));
      setValue("Address", employeeData.Address || "");
      setValue("Pincode", employeeData.Pincode || "");
      setValue("StateId", employeeData.StateId || "");
      setValue("CityId", employeeData.CityId || "");
    }
  }, [employeeData]);

  useEffect(() => {
    const formdata = new FormData();
    formdata.append("NomnieeTypeId", "-1");
    formdata.append("TitleId", "-1");
    formdata.append("StateId", "-1");
    formdata.append("CityId", "-1");
    formdata.append("LocationId", "-1");
    formdata.append("DesigantionID", "-1");
    formdata.append("DepartmentId", "-1");
    formdata.append("Status", "Z");
    formdata.append("UserToken", "");
    formdata.append("IP", "");
    formdata.append("MAC", "");
    formdata.append("UserId", "");
    formdata.append("GeoLocation", "");

    getDesignationService(formdata)
      .then((res) => {
        // console.log(res.data);
        setDesignations(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });

    getDepartmentService(formdata)
      .then((res) => {
        // console.log(res.data);
        setDepartments(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });

    getStateService(formdata)
      .then((res) => {
        // console.log(res.data?.result)
        setStates(res.data?.result);
      })
      .catch((err) => {
        console.log(err);
      });
    getCityService(formdata)
      .then((res) => {
        // console.log(res.data?.result)
        setCities(res.data?.result);
      })
      .catch((err) => {
        console.log(err);
      });
    getLocationsService(formdata)
      .then((res) => {
        // console.log(res.data?.result);
        setLocations(res.data?.result);
      })
      .catch((err) => {
        console.log(err);
      });
    getNomineeRelationService(formdata)
      .then((res) => {
        // console.log(res.data?.result)
        setRelations(res.data?.result);
      })
      .catch((err) => {
        console.log(err);
      });
    getTitleService(formdata)
      .then((res) => {
        // console.log(res.data?.result)
        setTitle(res.data?.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const hanldeOnChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    // console.log(currentDate);
    setShow(false);
    setValue("DateofJoining", currentDate);
    setDate(currentDate);
  };

  const hanldeDobOnChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowDob(false);
    setValue("Dateofbirth", currentDate);
    setDob(currentDate);
  };

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userData");
      if (jsonValue != null) {
        const userData = JSON.parse(jsonValue);
        setValue("MemberId", isNew ? "-1" : employeeData.MemberID);
        setValue("UserId", userData.UserId || "");
        setValue("UserToken", userData.UserToken || "");
        setValue("IP", "130.202.522.0255");
        setValue("MAC", "ASDS9232NSDSD");
        setValue("GeoLocation", "26.8467° N, 80.9462° E");
        return userData;
      }
    } catch (error) {
      console.error("Error retrieving user data", error);
    }
  };

  getUserData();

  const launchCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true, // Allows cropping and editing the image
      aspect: [4, 3], // Aspect ratio of the image
      quality: 1, // Image quality (0 to 1)
      base64: true, // Include base64 data in the result
    });

    if (!result.canceled) {
      setShowModal(result.canceled);
      setPicPreview(result.assets[0].uri);
      setProfileImage(result.assets[0].base64);
    } else {
      setShowModal(false);
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
      setPicPreview(result.assets[0].uri);
      setProfileImage(result.assets[0].base64);
    } else {
      setShowModal(false);
    }
  };

  const onSubmit = (data) => {
    console.log(data, "submit data");
    data.imgUser = profileImage;
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (key === "DateofJoining" || key === "Dateofbirth") {
        console.log(value, "Date");
        formData.append(key, value.toLocaleDateString("en-GB"));
      } else {
        formData.append(key, value.toString());
      }
    });
    registerService(formData)
      .then((res) => {
        console.log(res.data);
        if (res.data?.ResponseStatus == 1) {
          setPicPreview(null);
          setProfileImage(null);
          reset();
          setIsShow(true);
          setAlertType("info");
          setAlertMsg(res.data?.ResponseMessage);
        } else {
          setIsShow(true);
          setAlertType("error");
          setAlertMsg(res.data?.ResponseMessage);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsShow(true);
        setAlertType("error");
        setAlertMsg(error?.response?.data?.message);
      });
  };

  return (
    <>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        extraScrollHeight={80}
        enableOnAndroid={true}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ padding: 30 }}>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Title</Text>
              <View style={styles.pickerContainer}>
                <Controller
                  control={control}
                  name="TitleId"
                  render={({ field: { onChange, value } }) => (
                    <Picker
                      selectedValue={employeeData?.Title || value}
                      onValueChange={onChange}
                      style={styles.picker}
                      mode="dropdown"
                    >
                      <Picker.Item label="Select Title" value={""} />
                      {title &&
                        title.map((item) => {
                          return (
                            <Picker.Item
                              label={item?.Type}
                              value={item?.ID}
                              key={item?.ID}
                            />
                          );
                        })}
                    </Picker>
                  )}
                />
              </View>
              {errors.TitleId && (
                <Text style={styles.error}>{errors.TitleId.message}</Text>
              )}
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Full Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="FullName"
              />
              {errors.FullName && (
                <Text style={styles.error}>{errors.FullName.message}</Text>
              )}
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.pickerContainer}>
                <Controller
                  control={control}
                  name="Gender"
                  render={({ field: { onChange, value } }) => (
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={styles.picker}
                      mode="dropdown"
                    >
                      <Picker.Item label="Select Gender" value="" />
                      <Picker.Item label="Male" value="M" />
                      <Picker.Item label="Female" value="F" />
                    </Picker>
                  )}
                />
              </View>
              {errors.Gender && (
                <Text style={styles.error}>{errors.Gender.message}</Text>
              )}
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Mobile No</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Mobile No"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="MobileNo"
              />
              {errors.MobileNo && (
                <Text style={styles.error}>{errors.MobileNo.message}</Text>
              )}
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Alternate Mobile No</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Alternate Mobile"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="AlternateMob"
              />
              {errors.AlternateMob && (
                <Text style={styles.error}>{errors.AlternateMob.message}</Text>
              )}
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>E-mail</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter E-mail"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="EMail"
              />
              {errors.EMail && (
                <Text style={styles.error}>{errors.EMail.message}</Text>
              )}
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Father/Husband Name</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Father/Husband Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="FatherHusbandName"
              />
              {errors.FatherHusbandName && (
                <Text style={styles.error}>
                  {errors.FatherHusbandName.message}
                </Text>
              )}
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Application Date</Text>
              <Controller
                control={control}
                name="DateofJoining"
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <>
                    <TouchableOpacity onPress={() => setShow(true)}>
                      <TextInput
                        style={styles.input}
                        placeholder="Select Date of Joining"
                        value={employeeData?.DOJ || date.toLocaleDateString()}
                        editable={false}
                        pointerEvents="none"
                      />
                    </TouchableOpacity>

                    {/* {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode={"date"}
                      is24Hour={true}
                      onChange={(event, selectedDate) => {
                        hanldeOnChange(event, selectedDate);
                      }}
                    />
                  )} */}
                  </>
                )}
              />
              {errors.DateofJoining && (
                <Text style={styles.error}>{errors.DateofJoining.message}</Text>
              )}
            </View>
            <View style={styles.inputControl}>
              <Text style={[styles.inputLabel, { marginBottom: 0 }]}>
                Date of Birth
              </Text>
              <Text style={{ color: "red", fontSize: 12, marginHorizontal: 5 }}>
                *Should be 18 years old
              </Text>
              <Controller
                control={control}
                name="Dateofbirth"
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <>
                    <TouchableOpacity onPress={() => setShowDob(true)}>
                      <TextInput
                        style={styles.input}
                        placeholder="Select Date of Joining"
                        value={employeeData?.DOB || dob.toLocaleDateString()}
                        editable={false}
                        pointerEvents="none"
                      />
                    </TouchableOpacity>

                    {showDob && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={dob}
                        mode={"date"}
                        is24Hour={true}
                        onChange={(event, selectedDate) => {
                          hanldeDobOnChange(event, selectedDate);
                        }}
                      />
                    )}
                  </>
                )}
              />
              {errors.Dateofbirth && (
                <Text style={styles.error}>{errors.Dateofbirth.message}</Text>
              )}
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Designation</Text>
              <View style={styles.pickerContainer}>
                <Controller
                  control={control}
                  name="DesignationId"
                  render={({ field: { onChange, value } }) => (
                    <Picker
                      selectedValue={employeeData?.DesignationID || value}
                      onValueChange={onChange}
                      style={styles.picker}
                      mode="dropdown"
                    >
                      <Picker.Item label={"Select Designation"} value={""} />
                      {designations &&
                        designations.map((item) => {
                          return (
                            <Picker.Item
                              label={item?.Designation}
                              value={item?.DesignationID}
                              key={item?.DesignationID}
                            />
                          );
                        })}
                    </Picker>
                  )}
                />
              </View>
              {errors.DesignationId && (
                <Text style={styles.error}>{errors.DesignationId.message}</Text>
              )}
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Select Location</Text>
              <View style={styles.pickerContainer}>
                <Controller
                  control={control}
                  name="LocationId"
                  render={({ field: { onChange, value } }) => (
                    <Picker
                      selectedValue={employeeData?.LocationId || value}
                      onValueChange={onChange}
                      style={styles.picker}
                      mode="dropdown" // Dropdown mode for better UI
                    >
                      <Picker.Item label="Select Location" value="" />

                      {locations &&
                        locations.map((item) => {
                          return (
                            <Picker.Item
                              label={item?.Location}
                              value={item?.LocationId}
                              key={item?.LocationId}
                            />
                          );
                        })}
                    </Picker>
                  )}
                />
              </View>
              {errors.LocationId && (
                <Text style={styles.error}>{errors.LocationId.message}</Text>
              )}
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Select Staff</Text>
              <View style={styles.pickerContainer}>
                <Controller
                  control={control}
                  name="StaffTypeCode"
                  render={({ field: { onChange, value } }) => (
                    <Picker
                      selectedValue={employeeData?.StaffTypeCode || value}
                      onValueChange={onChange}
                      style={styles.picker}
                      mode="dropdown" // Dropdown mode for better UI
                    >
                      <Picker.Item label="Select Staff Type" value="" />
                      <Picker.Item label="Office" value="OS" />
                      <Picker.Item label="Field Staff" value="FS" />
                      {/* <Picker.Item label="Other" value="other" /> */}
                    </Picker>
                  )}
                />
              </View>
              {errors.StaffTypeCode && (
                <Text style={styles.error}>{errors.StaffTypeCode.message}</Text>
              )}
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Select Department ID</Text>
              <View style={styles.pickerContainer}>
                <Controller
                  control={control}
                  name="DepartmentId"
                  render={({ field: { onChange, value } }) => (
                    <Picker
                      selectedValue={employeeData?.DepartmentId || value}
                      onValueChange={onChange}
                      style={styles.picker}
                      mode="dropdown" // Dropdown mode for better UI
                    >
                      <Picker.Item label="Select Department" value="" />
                      {departments &&
                        departments?.map((item) => {
                          return (
                            <Picker.Item
                              label={item.Department}
                              value={item.DepartmentId}
                              key={item.DepartmentId}
                            />
                          );
                        })}
                    </Picker>
                  )}
                />
              </View>
              {errors.DepartmentId && (
                <Text style={styles.error}>{errors.DepartmentId.message}</Text>
              )}
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Residential Address</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textarea}
                    placeholder="Enter Residential Address"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      if (isSameAddress) {
                        setValue("PermanentAddress", text); // Automatically copy to PermanentAddress
                      }
                    }}
                    value={value}
                    multiline={true} // Enable multiple lines
                    numberOfLines={4} // Set visible lines
                  />
                )}
                name="Address"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 8,
              }}
            >
              <Checkbox
                value={isSameAddress}
                onValueChange={(newValue) => {
                  setIsSameAddress(newValue);
                  if (newValue) {
                    setValue("PermanentAddress", getValues("Address")); // Copy Residential address
                  } else {
                    setValue("PermanentAddress", ""); // Clear if unchecked
                  }
                }}
                // style={{ backgroundColor: "orange" }}
                color="orange"
              />
              <Text style={{ marginLeft: 8 }}>Same as Residential Address</Text>
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Permanent Address</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textarea}
                    placeholder="Permanent Address"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline={true} // Enable multiple lines
                    numberOfLines={4} // Set visible lines
                    editable={!isSameAddress}
                  />
                )}
                name="PermanentAddress"
              />
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Pin Code</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Pin Code"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="Pincode"
              />
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Select State</Text>
              <View style={styles.pickerContainer}>
                <Controller
                  control={control}
                  name="StateId"
                  render={({ field: { onChange, value } }) => (
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={styles.picker}
                      mode="dropdown"
                    >
                      <Picker.Item label={"Select State"} value={""} />
                      {states &&
                        states.map((item) => {
                          return (
                            <Picker.Item
                              label={item?.State}
                              value={item?.StateId}
                              key={item?.StateId}
                            />
                          );
                        })}
                    </Picker>
                  )}
                />
              </View>
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Select City</Text>
              <View style={styles.pickerContainer}>
                <Controller
                  control={control}
                  name="CityId"
                  render={({ field: { onChange, value } }) => (
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={styles.picker}
                      mode="dropdown"
                    >
                      <Picker.Item label={"Select City"} value={""} />
                      {cities &&
                        cities.map((item) => {
                          return (
                            <Picker.Item
                              label={item?.City}
                              value={item?.CityID}
                              key={item?.CityID}
                            />
                          );
                        })}
                    </Picker>
                  )}
                />
              </View>
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Profile Image</Text>
              <View style={styles.imagePickerContainer}>
                <TouchableOpacity onPress={() => setShowModal(true)}>
                  <View
                    style={[
                      styles.imagePlaceholder,
                      { height: picPreview ? 200 : 50 },
                    ]}
                  >
                    {picPreview ? (
                      <Image
                        source={{ uri: picPreview }}
                        style={styles.image}
                      />
                    ) : (
                      <Text style={{ color: "gray", fontWeight: 500 }}>
                        Choose Profile Image
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Nominee Name</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Nominee Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="NomineeName"
              />
            </View>
            <View style={styles.inputControl}>
              <Text style={styles.inputLabel}>Select Nominee Relation</Text>
              <View style={styles.pickerContainer}>
                <Controller
                  control={control}
                  name="NomineeRelation"
                  render={({ field: { onChange, value } }) => (
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={styles.picker}
                      mode="dropdown" // Dropdown mode for better UI
                    >
                      <Picker.Item label="Select Relation" value="" />
                      {relations &&
                        relations.map((item) => {
                          return (
                            <Picker.Item
                              label={item?.NomnieeType}
                              value={item?.NomnieeTypeId}
                              key={item?.NomnieeTypeId}
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
                    placeholder="Enter Nominee Aadhar No"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="NomineeAdharNo"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
                paddingHorizontal: 20,
              }}
            >
              <CustomButton
                btnText={"Reset"}
                style={[styles.btn, { backgroundColor: COLORS.secondary }]}
                onPress={() => reset()}
                btnTextColor={COLORS.primary}
              />
              <CustomButton
                btnText={"Submit"}
                style={[styles.btn, { backgroundColor: COLORS.secondary }]}
                onPress={handleSubmit(onSubmit)}
                btnTextColor={COLORS.primary}
              />
            </View>
            <MyModal
              modalVisible={showModal}
              setModalVisible={setShowModal}
              action1={launchCamera}
              action2={pickImage}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
      <CustomAlert
        visible={isShow}
        message={alertMsg}
        type={alertType}
        setVisible={setIsShow}
      />
      <AlertView />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // marginVertical: 10,
    width: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "orange",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
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
    borderStyle: "solid",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  imagePickerContainer: {
    // alignItems: "center",
    // marginBottom: 20,
  },
  imagePlaceholder: {
    height: 50,
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
  textarea: {
    height: 100,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    borderWidth: 1,
    borderColor: "#C9D3DB",
    borderStyle: "solid",
    flex: 1,
    marginBottom: 10,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
});
export default EmployeeRegistration;
