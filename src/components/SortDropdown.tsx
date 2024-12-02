import { Icon } from "@gluestack-ui/themed";
import { Menu } from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Text,
} from "react-native";

interface SortDropdownProps {
  onSortChange: (value: string) => void;
}

export function SortDropdown({ onSortChange }: SortDropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("asc");

  const options = [
    { label: "Ordenar de A-Z", value: "asc" },
    { label: "Ordenar de Z-A", value: "desc" },
  ];

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setModalVisible(false);
    onSortChange(value);
  };


  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Icon as={Menu} color="$white" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "#323238",
    borderRadius: 8,
    padding: 10,
    width: 55,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#323238",
    borderRadius: 8,
    padding: 20,
    width: 200,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#7C7C8A",
  },
  icon: {
    marginRight: 10,
  },
  optionText: {
    color: "white",
  },
});
