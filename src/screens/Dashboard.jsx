import React, { useEffect, useState } from "react";
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
function Dashboard({ navigation }) {
  const [time, setTime] = useState("");
  const [userName, setUserName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime(); // Set initial time
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

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

  function handleLogout() {
    // Clear AsyncStorage and navigate to login screen
    AsyncStorage.clear()
      .then(() => {
        navigation.replace(SCREENS.LOGIN);
      })
      .catch((error) => {
        console.error("Failed to clear AsyncStorage", error);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with logo, username and time */}
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} style={styles.image} />
        <Text style={{ fontSize: 18, fontWeight: "600" }}>{userName}</Text>
        {/* <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "green",
            paddingHorizontal: 10,
          }}
        >
          {time}
        </Text> */}
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
      </View>
      <ConfirmModal
        modalText={"Are you sure you want to logout?"}
        modalVisible={modalVisible}
        setModalVisible={() => setModalVisible(false)}
        onConfirm={() => handleLogout()}
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
