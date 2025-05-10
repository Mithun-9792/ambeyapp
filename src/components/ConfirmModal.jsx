import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import CustomButton from "./CustomButton";
import { COLORS } from "../constants/colors";

function ConfirmModal({
  modalText,
  modalVisible,
  setModalVisible,
  onConfirm,
  onCancel,
}) {
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
              <Text style={styles.modalText}>{modalText}</Text>
              <View style={styles.btnRow}>
                {/* <ActionButton title="Yes" onPress={() => onConfirm()} />
                <ActionButton title="No" onPress={() => onCancel()} /> */}
                <CustomButton
                  btnText={"Yes"}
                  onPress={onConfirm}
                  style={styles.button}
                />
                <CustomButton
                  btnText={"No"}
                  onPress={onCancel}
                  style={styles.button}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

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
  button: {
    backgroundColor: COLORS.secondary,
    width: "40%",
    margin: 10,
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    minHeight: 50,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
});

export default ConfirmModal;
