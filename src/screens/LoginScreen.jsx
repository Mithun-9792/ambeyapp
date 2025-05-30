import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { loginService } from "../services/auth.services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../constants/colors";
import useToaster from "../hooks/useToaster";
import { SCREENS } from "../constants/route";
import { AuthContext } from "../authContext/AuthContext";
export default function Example({ navigation }) {
  const { login } = useContext(AuthContext);
  const { AlertView, showAlert } = useToaster();
  const [form, setForm] = useState({
    UserId: "",
    Password: "",
    IP: "",
    MAC: "",
    Geolocation: "",
  });

  const handleLogin = () => {
    if (form.UserId === "" || form.Password === "") {
      showAlert("Please fill all the fields", "info");
      return;
    }
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });
    console.log(formData);
    loginService(formData)
      .then((res) => {
        console.log(res.data);
        // storeUserData(res.data?.result[0]);
        login(res.data?.result[0]);
        setForm({
          UserId: "",
          Password: "",
          IP: "",
          MAC: "",
          Geolocation: "",
        });
      })
      .catch((err) => {
        console.log(err.response.data);
        alert(err.response.data.Message);
      });
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>User Name</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="number-pad"
              onChangeText={(UserId) => setForm({ ...form, UserId })}
              placeholder="ex:- 1256358"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.UserId}
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(Password) => setForm({ ...form, Password })}
              placeholder="********"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry={true}
              value={form.Password}
            />
          </View>
          <View style={styles.formAction}>
            <TouchableOpacity
              onPress={() => {
                handleLogin();
              }}
            >
              <View style={styles.btn}>
                <Text style={styles.btnText}>Sign in</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => {}}>
            {/* <Text style={styles.formFooter}>
              Don't have an account?{" "}
              <Text style={{ textDecorationLine: "underline" }}>Sign up</Text>
            </Text> */}
          </TouchableOpacity>
        </View>
      </View>
      <AlertView />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  logo: {
    width: 400,
    height: 200,
    alignSelf: "center",
  },
  header: {
    marginVertical: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1d1d1d",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
    textAlign: "center",
  },
  /** Form */
  form: {
    marginBottom: 24,
  },
  formAction: {
    marginVertical: 24,
    padding: 10,
  },
  formFooter: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    textAlign: "center",
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  /** Button */
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    padding: 30,
    borderWidth: 1,
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.primary,
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
