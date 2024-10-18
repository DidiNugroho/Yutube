import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";  
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
  ScrollView,
  Alert,
} from "react-native";

const CREATE_POST = gql`
  mutation Mutation($content: String!, $tags: [String], $imgUrl: String) {
    createPost(content: $content, tags: $tags, imgUrl: $imgUrl) {
      _id
      authorId
      content
      imgUrl
      createdAt
    }
  }
`;

export default function CreatePostModal({ visible, onClose }) {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [username, setUsername] = useState("")

  const user = {
    username: username,
    profilePicture: "https://picsum.photos/500/500?random",
  };

  useEffect(() => {  
    const getUsername = async () => {  
      const username = await SecureStore.getItemAsync("username");  
      setUsername(username);  
    };  
    getUsername();  
  }, []);

  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    onCompleted: (data) => {
      Alert.alert("Success", "Post created successfully!");
      resetForm();
      onClose();
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const resetForm = () => {
    setContent("");
    setTags("");
    setImgUrl("");
  };

  const handleSubmit = () => {
    const formattedTags = tags
      ? tags.split(",").map((tag) => tag.trim())
      : [];

    if (!content.trim()) {
      Alert.alert("Validation Error", "Content cannot be empty.");
      return;
    }

    createPost({
      variables: {
        content,
        tags: formattedTags,
        imgUrl,
      },
    });
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
          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            <Text style={[styles.postButton, loading && styles.disabledButton]}>
              {loading ? "Posting..." : "Post"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formWrapper}>
          <ScrollView contentContainerStyle={styles.formContainer}>
            <TextInput
              style={styles.contentInput}
              placeholder="What's on your mind?"
              value={content}
              onChangeText={setContent}
              multiline
            />
          </ScrollView>

          <View style={styles.bottomInputs}>
            <TextInput
              style={styles.input}
              placeholder="Enter tags (comma-separated)"
              value={tags}
              onChangeText={setTags}
            />

            <TextInput
              style={styles.input}
              placeholder="Image URL"
              value={imgUrl}
              onChangeText={setImgUrl}
            />
          </View>
        </View>

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
  disabledButton: {
    color: "gray",
  },
  formWrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  formContainer: {
    flexGrow: 1,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 10,
    height: 500,
  },
  bottomInputs: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  footer: {
    marginBottom: 20,
  },
});
