import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Pressable,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../components/CustomButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  getDepartmentService,
  getDesignationService,
  getStateService,
  registerService,
} from "../services/auth.services";
import AsyncStorage from "@react-native-async-storage/async-storage";

const schema = yup.object().shape({
  employeeCode: yup.string().required("Employee Code is required"),
  FullName: yup.string().required("Full Name is required"),
  MemberId: yup.string().required("Member Id is required"),
  // gender: yup.string().required("Gender is required"),
  // fatherHusband: yup.string().required("Father/Husband Name is required"),
  // // DateofJoining: yup.date().required("Date of Joining is required"),
  // // Dateofbirth: yup.date().required("Date of Birth is required"),
  // cugno: yup.number(),
  // AlternateMob: yup.string(),
  // EMail: yup.string().email("Invalid email"),
  // landlineNo: yup.string(),
  // Pincode: yup.string(),
  // LocationId: yup.string(),
  // StaffTypeCode: yup.string().required("Staff Type is required"),
  // designation: yup.string().required("Designation is required"),
  // DepartmentId: yup.string().required("Department is required"),
  // NomineeName: yup.string().required("Nominee Name is required"),
  // nomineeRelation: yup.string().required("Nominee Relation is required"),
  // NomineeAdharNo: yup.string(),
  // residentialAddress: yup.string(),
  // PermanentAddress: yup.string(),
  // qualification: yup.string(),
  // // qualification: yup.array().of(yup.string()),
  // documentType: yup.string(),
  // documentNo: yup.string(),
  // expiryDate: yup.date(),
});

const EmployeeRegister = () => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [profileImage, setProfileImage] = useState(null);
  const [documentImage, setDocumentImage] = useState(null);
  const [showDatePickerJoining, setShowDatePickerJoining] = useState(false);
  const [showDatePickerBirth, setShowDatePickerBirth] = useState(false);
  const [dateofjoining, setDateofjoining] = useState(new Date());
  // const [dateofbirth, setDateofbirth] = useState(new Date());
  const [showDatePickerExpiry, setShowDatePickerExpiry] = useState(false);
  const [userData, setUserData] = useState(null);
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    const formdata = new FormData();
    formdata.append("StateId", "-1");
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
        console.log(res.data?.result)
        setStates(res.data?.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userData");
      if (jsonValue != null) {
        const userData = JSON.parse(jsonValue);
        setUserData(userData);
        setValue("MemberId", userData.MemberId?.toString() || "");
        setValue("FullName", userData.Name || "");
        setValue("MobileNo", userData.Mobile || "");
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
  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmit = (data) => {
    data.imgUser = "profileImage";
    // data.imgDocument = documentImage;
    console.log(data);
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      // Format date fields as dd/mm/yyyy
      if (key === "DateofJoining" || key === "Dateofbirth") {
        formData.append(key, new Date(value).toLocaleDateString());
      }
      // else if (key === "imgUser") {
      //   // If imgUser is a local file URI (e.g., from ImagePicker), handle it like this:
      //   formData.append("imgUser", {
      //     uri: value,
      //     type: "image/jpeg", // or detect from file
      //     name: "user_image.jpg",
      //   });
      // }
      else {
        formData.append(key, value.toString());
      }
    });

    console.log(data);
    registerService(formData)
      .then((res) => {
        console.log(res.data);
        // if (res.data.StatusCode == 200) {
        //   alert("Employee Registered Successfully");
        //   reset();
        // } else {

        //   alert(res.data.Message);
        // }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const showJoiningDatePicker = () => setShowDatePickerJoining(true);
  const showBirthDatePicker = () => setShowDatePickerBirth(true);
  const showExpiryDatePicker = () => setShowDatePickerExpiry(true);

  // const onChangeJoiningDate = (event, selectedDate) => {
  //   console.log(selectedDate, event);
  //   const date = new Date(isoDate);

  //   const currentDate = date.toLocaleDateString();
  //   setShowDatePickerJoining(Platform.OS === "ios");
  //   // setDateofjoining(currentDate);
  //   // setValue("DateofJoining", currentDate);
  //   // control._fields.DateofJoining.onChange(currentDate);
  //   // console.log("Joining Date", selectedDate, control._fields.DateofJoining);
  // };

  // const onChangeBirthDate = (event, selectedDate) => {
  //   const currentDate = selectedDate || control._formValues.Dateofbirth;
  //   setShowDatePickerBirth(Platform.OS === "ios");
  //   control._fields.Dateofbirth.onChange(currentDate);
  // };

  const onChangeExpiryDate = (event, selectedDate) => {
    const currentDate = selectedDate || control._formValues.expiryDate;
    setShowDatePickerExpiry(Platform.OS === "ios");
    control._fields.expiryDate.onChange(currentDate);
  };

  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>Employee Registration</Text>
      </View> */}
      <View style={{ marginBottom: 30 }}>
        <View style={styles.inputControl}>
          <Text style={styles.inputLabel}>Member Id</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter Member Id"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="MemberId"
          />
          {errors.MemberId && (
            <Text style={styles.error}>{errors.MemberId.message}</Text>
          )}
        </View>
        <View style={styles.inputControl}>
          <Text style={styles.inputLabel}>Registration Code</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter Registration Code"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="RegistrationCode"
          />
          {errors.RegistrationCode && (
            <Text style={styles.error}>{errors.RegistrationCode.message}</Text>
          )}
        </View>
        <View style={styles.inputControl}>
          <Text style={styles.inputLabel}>Title ID</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter Title ID"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="TitleId"
          />
          {errors.TitleId && (
            <Text style={styles.error}>{errors.TitleId.message}</Text>
          )}
        </View>
        <View style={styles.inputControl}>
          <Text style={styles.inputLabel}>Employee Code</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter Employee Code"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="employeeCode"
          />
          {errors.employeeCode && (
            <Text style={styles.error}>{errors.employeeCode.message}</Text>
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
        {/* <View style={styles.inputControl}>
          <Text style={styles.inputLabel}>Middle Name</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Middle Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="middleName"
          />
          {errors.middleName && (
            <Text style={styles.error}>{errors.middleName.message}</Text>
          )}
        </View> */}
        {/* <View style={styles.inputControl}>
          <Text style={styles.inputLabel}>Last Name</Text>{" "}
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="lastName"
          />
          {errors.lastName && (
            <Text style={styles.error}>{errors.lastName.message}</Text>
          )}
        </View> */}
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
                  <Picker.Item label="Male" value="M" />
                  <Picker.Item label="Female" value="F" />
                  <Picker.Item label="Other" value="O" />
                </Picker>
              )}
            />
          </View>
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
        </View>
        <View style={styles.inputControl}>
          <Text style={styles.inputLabel}>Date of Joining</Text>
          <Controller
            control={control}
            name="DateofJoining"
            defaultValue={dateofjoining}
            render={({ field: { onChange, onBlur, value } }) => (
              <TouchableOpacity onPress={() => setShowDatePickerJoining(true)}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Date of Joining"
                  onBlur={onBlur}
                  value={value ? new Date(value).toLocaleDateString() : ""}
                  editable={false}
                  pointerEvents="none" // To prevent keyboard
                />
                {showDatePickerJoining && (
                  <DateTimePicker
                    testID="joiningDatePicker"
                    value={dateofjoining || new Date()} // Make sure it's always up to date
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePickerJoining(false);
                      if (selectedDate) {
                        setDateofjoining(selectedDate); // Update local state
                        onChange(selectedDate); // Pass the selected date to the form control
                      }
                    }}
                  />
                )}
              </TouchableOpacity>
            )}
          />
          {errors.DateofJoining && (
            <Text style={styles.error}>{errors.DateofJoining.message}</Text>
          )}
        </View>

        <View style={styles.inputControl}>
          <Text style={styles.inputLabel}>Date of Birth</Text>
          <Controller
            control={control}
            name="Dateofbirth"
            render={({ field: { onChange, onBlur, value } }) => (
              <TouchableOpacity onPress={showBirthDatePicker}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Date of Birth"
                  onBlur={onBlur}
                  value={value ? new Date(value).toLocaleDateString() : ""}
                  editable={false}
                />
                {showDatePickerBirth && (
                  <DateTimePicker
                    testID="birthDatePicker"
                    value={value}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePickerBirth(false);
                      if (selectedDate) {
                        onChange(selectedDate);
                      }
                    }}
                  />
                )}
              </TouchableOpacity>
            )}
          />
          {errors.Dateofbirth && (
            <Text style={styles.error}>{errors.Dateofbirth.message}</Text>
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
        </View>

        <View style={styles.inputControl}>
          <Text style={styles.inputLabel}>Alternate Mobile No</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter ALternate Mobile"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="AlternateMob"
          />
        </View>
        <View style={styles.inputControl}>
          <Text style={styles.inputLabel}>Designation</Text>
          <View style={styles.pickerContainer}>
            <Controller
              control={control}
              name="DesignationId"
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.picker}
                  mode="dropdown"
                >
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
          <Text style={styles.inputLabel}>Select Location</Text>
          <View style={styles.pickerContainer}>
            <Controller
              control={control}
              name="LocationId"
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.picker}
                  mode="dropdown" // Dropdown mode for better UI
                >
                  <Picker.Item label="Select Location" value="" />
                  <Picker.Item label="Lucknow" value="1" />
                  <Picker.Item label="Kanpur" value="2" />
                  <Picker.Item label="Other" value="3" />
                </Picker>
              )}
            />
          </View>
        </View>
        {/* Profile Image */}
        <View style={styles.inputControl}>
          <Text style={styles.inputLabel}>Profile Image</Text>
          <View style={styles.imagePickerContainer}>
            <TouchableOpacity onPress={() => pickImage(setProfileImage)}>
              <View style={styles.imagePlaceholder}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.image} />
                ) : (
                  <Text>Choose Profile Image</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputControl}>
          <Text style={styles.inputLabel}>Select Staff</Text>
          <View style={styles.pickerContainer}>
            <Controller
              control={control}
              name="StaffTypeCode"
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.picker}
                  mode="dropdown" // Dropdown mode for better UI
                >
                  <Picker.Item label="Select Staff Type" value="" />
                  <Picker.Item label="Office" value="office" />
                  <Picker.Item label="Field" value="field" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              )}
            />
          </View>
        </View>
        <View style={styles.inputControl}>
          <Text style={styles.inputLabel}>Select Department ID</Text>
          <View style={styles.pickerContainer}>
            <Controller
              control={control}
              name="DepartmentId"
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
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
                  <Picker.Item label="Father" value="1" />
                  <Picker.Item label="Monther" value="2" />
                  <Picker.Item label="Brother" value="3" />
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
        <View style={styles.inputControl}>
          <Text style={styles.inputLabel}>Residential Address</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textarea}
                placeholder="Enter Residential Address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline={true} // Enable multiple lines
                numberOfLines={4} // Set visible lines
              />
            )}
            name="Address"
          />
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
              />
            )}
            name="PermanentAddress"
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
                  <Picker.Item label="Lucknow" value="1" />
                  <Picker.Item label="Kanpur" value="2" />
                  <Picker.Item label="Unnao" value="3" />
                  <Picker.Item label="LMP" value="4" />
                </Picker>
              )}
            />
          </View>
        </View>
        {/* <View style={styles.pickerContainer}>
          <Controller
            control={control}
            name="qualification"
            render={({ field: { onChange, value } }) => (
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={styles.picker}
                mode="dropdown"
              >
                <Picker.Item label="High School" value="High School" />
                <Picker.Item label="Inter Mediate" value="Inter Mediate" />
                <Picker.Item label="Diploma" value="Diploma" />
                <Picker.Item label="B.Tech" value="Btech" />
                <Picker.Item label="B.Sc" value="Bsc" />
                <Picker.Item label="B.A" value="BA" />
                <Picker.Item label="M.Sc" value="Msc" />
                <Picker.Item label="M.A" value="MA" />
                <Picker.Item label="NAN" value="NAN" />
              </Picker>
            )}
          />
        </View> */}
        {/* <View style={styles.pickerContainer}>
          <Controller
            control={control}
            name="documentType"
            render={({ field: { onChange, value } }) => (
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={styles.picker}
                mode="dropdown"
              >
                <Picker.Item label="Aadhar Card" value="AadharCard" />
                <Picker.Item label="PAN Card" value="PAN" />
                <Picker.Item label="Driving License" value="DL" />
              </Picker>
            )}
          />
        </View> */}
        {/* <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Document No"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="documentno"
        /> */}
        {/* <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TouchableOpacity onPress={showExpiryDatePicker}>
              <TextInput
                style={styles.input}
                placeholder="Expiry Date"
                onBlur={onBlur}
                value={value ? value.toDateString() : ""}
                editable={false}
              />
            </TouchableOpacity>
          )}
          name="expiryDate"
        />
        {errors.expiryDate && (
          <Text style={styles.error}>{errors.expiryDate.message}</Text>
        )}

        {showDatePickerExpiry && (
          <DateTimePicker
            testID="expiryDatePicker"
            value={control._formValues.expiryDate || new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeExpiryDate}
          />
        )} */}

        {/* <View style={styles.imagePickerContainer}>
          <TouchableOpacity onPress={() => pickImage(setDocumentImage)}>
            <View style={styles.imagePlaceholder}>
              {documentImage ? (
                <Image source={{ uri: documentImage }} style={styles.image} />
              ) : (
                <Text>Upload Document</Text>
              )}
            </View>
          </TouchableOpacity>
        </View> */}

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
            style={[styles.btn, { backgroundColor: "red" }]}
            onPress={() => reset()}
          />
          <CustomButton
            btnText={"Submit"}
            style={[styles.btn, { backgroundColor: "green" }]}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginVertical: 10,
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
    // backgroundColor: "orange",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
});

export default EmployeeRegister;
