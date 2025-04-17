import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SCREENS } from "../constants/route";
import ActionButton from "../components/ActionButton"; // Import your new component

function Dashboard({ navigation }) {
  const [time, setTime] = useState("");
  const [userName, setUserName] = useState("");

  // Emp009792;
  // Update time every second with seconds included
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with logo, username and time */}
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} style={styles.image} />
        <Text style={{ fontSize: 18, fontWeight: "600" }}>{userName}</Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "green",
            paddingHorizontal: 10,
          }}
        >
          {time}
        </Text>
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
          onPress={() => navigation.push(SCREENS.EMPLOYEEUPLOADDOC)}
        />

        <ActionButton
          title="User Report"
          ImageName="newspaper-o"
          onPress={() => navigation.push(SCREENS.USERREPORT)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 40,
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
    borderColor: "orange",
  },
  page: {
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#fff",
    margin: 10,
    borderColor: "orange",
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
    justifyContent: "space-between",
    marginHorizontal: 20,
    flexWrap: "wrap",
  },
});

export default Dashboard;
