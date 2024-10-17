// SearchModal.js
import React, { useState } from "react";
import { Modal, View, TextInput, Button, StyleSheet, Text } from "react-native";

export default function SearchModal({ visible, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Search Users</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter username..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Button title="Search" onPress={handleSearch} />
        <Button title="Cancel" onPress={onClose} color="tomato" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});
