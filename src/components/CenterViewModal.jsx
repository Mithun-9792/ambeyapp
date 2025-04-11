import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import CustomButton from "./CustomButton";
import ActionButton from "./ActionButton";

const MyModal = ({ modalVisible, setModalVisible, action1, action2 }) => {
  return (
    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Choose an option</Text>
              <View style={styles.btnRow}>
                <ActionButton
                  // title="C"
                  ImageName="camera"
                  onPress={() => action1()}
                />
                <ActionButton
                  // title="Employee Upload Doc"
                  ImageName="photo"
                  onPress={() => action2()}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
});

export default MyModal;
