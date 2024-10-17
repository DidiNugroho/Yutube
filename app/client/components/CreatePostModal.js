import { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

export default function CreatePostModal({ visible, onClose }) {
  const [content, setContent] = useState("");

  const user = {
    username: "PlaceholderUser",
    profilePicture: "https://via.placeholder.com/150",
  };

  const handleSubmit = () => {
    console.log("Post Created:", { content, user });
    onClose();
    setContent("");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.profileImage}
            />
            <Text style={styles.username}>{user.username}</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.postButton}>Post</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.contentInput}
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          multiline
        />

        <View style={styles.footer}>
          <Button title="Close" color="red" onPress={onClose} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postButton: {
    fontSize: 16,
    color: "tomato",
    fontWeight: "bold",
  },
  contentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  footer: {
    marginBottom: 20,
  },
});
