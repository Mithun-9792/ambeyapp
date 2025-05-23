import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SCREENS } from "../constants/route";
import ActionButton from "../components/ActionButton"; // Import your new component
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { COLORS } from "../constants/colors";
import ConfirmModal from "../components/ConfirmModal";
import { AuthContext } from "../authContext/AuthContext";
function Dashboard({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);


  // Fetch user data from AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("userData");
        if (jsonValue != null) {
          const parsedData = JSON.parse(jsonValue);
          setUserName(parsedData.Name);
        }
      } catch (e) {
        console.error("Failed to load user data", e);
      }
    };

    fetchUserData();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      {/* Header with logo, username and time */}
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} style={styles.image} />
        <Text style={{ fontSize: 18, fontWeight: "600" }}>{userName}</Text>
       
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <FontAwesome
            name="power-off"
            size={24}
            color="black"
            style={{ color: "red" }}
          />
        </TouchableOpacity>
      </View>

      {/* Image slider */}
      <PagerView style={styles.slider} initialPage={0}>
        <View style={styles.page} key="1">
          <Image
            source={{ uri: "https://ambey.co.in/Images/services/04.jpg" }}
            style={styles.sliderImage}
          />
        </View>
        <View style={styles.page} key="2">
          <Image
            source={{ uri: "https://ambey.co.in/Images/services/07.jpg" }}
            style={styles.sliderImage}
          />
        </View>
        <View style={styles.page} key="3">
          <Image
            source={{ uri: "https://ambey.co.in/Images/services/06.jpg" }}
            style={styles.sliderImage}
          />
        </View>
      </PagerView>

      {/* Row of buttons with images */}
      <View style={styles.btnRow}>
        <ActionButton
          title="Employee Register"
          ImageName="user-plus"
          onPress={() =>
            navigation.push(SCREENS.EMPLOYEEREGISTRATION, { isNew: true })
          }
        />
        <ActionButton
          title="Employee Upload Doc"
          ImageName="upload"
          onPress={() =>
            navigation.push(SCREENS.EMPLOYEEUPLOADDOC, {
              userRegistrationId: "",
            })
          }
        />

        <ActionButton
          title="User Report"
          ImageName="newspaper-o"
          onPress={() => navigation.push(SCREENS.USERREPORT)}
        />
        <ActionButton
          title="Vehicle Log"
          ImageName="file-text"
          onPress={() =>
            navigation.push(SCREENS.VEHICLELOG, { isShowLogs: false })
          }
        />
        <ActionButton
          title="Show Vehicle Reports"
          ImageName="file-text-o"
          onPress={() =>
            navigation.push(SCREENS.VEHICLELOG, { isShowLogs: true })
          }
        />
        <ActionButton
          title="Mark Attendence"
          ImageName="users"
          onPress={() => navigation.push(SCREENS.MARKATTENDENCE)}
        />
        <ActionButton
          title="Attendence"
          ImageName="calendar"
          onPress={() => navigation.push(SCREENS.ATTENDECEREPORT)}
        />
      </View>
      <ConfirmModal
        modalText={"Are you sure you want to logout?"}
        modalVisible={modalVisible}
        setModalVisible={() => setModalVisible(false)}
        onConfirm={logout}
        onCancel={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
    // marginTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  page: {
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#fff",
    margin: 10,
    borderColor: COLORS.primary,
    shadowColor: "#000",
  },
  sliderImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 8,
  },
  slider: {
    height: 200,
    width: "100%",
    marginTop: 10,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 20,
    flexWrap: "wrap",
    gap: 10,
  },
});

export default Dashboard;
