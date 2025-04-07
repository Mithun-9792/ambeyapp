import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import CustomButton from "../components/CustomButton";
import { SCREENS } from "../constants/route";

function Dashboard({ navigation }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime(); // Set initial time
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* <Image source={"../assets/logo.png"} style={styles.image} /> */}
        <Image source={require("../assets/logo.png")} style={styles.image} />

        <Text style={{ fontSize: 18, fontWeight: 600 }}>UserName</Text>
        <Text>{time}</Text>
      </View>
      <PagerView style={styles.slider} initialPage={0}>
        <View style={styles.page} key="1">
          <Image
            source={{
              uri: "https://ambey.co.in/Images/services/04.jpg",
            }}
            style={styles.sliderImage}
          />
        </View>
        <View style={styles.page} key="2">
          <Image
            source={{
              uri: "https://ambey.co.in/Images/services/07.jpg",
            }}
            style={styles.sliderImage}
          />
        </View>
        <View style={styles.page} key="3">
          <Image
            source={{
              uri: "https://ambey.co.in/Images/services/06.jpg",
            }}
            style={styles.sliderImage}
          />
        </View>
      </PagerView>
      <View style={{ marginHorizontal: 20 }}>
        <CustomButton
          btnText={"Employee Register"}
          onPress={() => navigation.push(SCREENS.EMPLOYEEREGISTER)}
          style={styles.btn}
        />
        <CustomButton
          btnText={"Employee Upload Doc"}
          style={styles.btn}
          onPress={() => navigation.push(SCREENS.EMPLOYEEUPLOADDOC)}
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
    objectFit: "contain",
  },
  page: {
    // width: "98%",
    // height: "100%",
    borderRadius: 10,
    borderWidth: 2,
    padding: 0,
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
  btn: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
  },
});
export default Dashboard;
