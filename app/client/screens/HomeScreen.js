import React from "react";
import { View, Text, Image, FlatList, StyleSheet, Button } from "react-native";

export default function HomeScreen({ navigation }) {
 
  const posts = [
    {
      _id: "1",
      content: "Check out this amazing post!",
      tags: ["fun", "react-native"],
      imgUrl: "https://via.placeholder.com/150",
      authorData: { name: "John Doe" },
      comments: [{ text: "Nice post!" }],
      likes: [{ userId: "123" }],
      createdAt: "2024-10-16T14:30:00Z",
    },
    {
      _id: "2",
      content: "Learning React Native is awesome!",
      tags: ["react-native", "coding"],
      imgUrl: "https://via.placeholder.com/150",
      authorData: { name: "Jane Smith" },
      comments: [{ text: "Super helpful!" }],
      likes: [{ userId: "456" }],
      createdAt: "2024-10-15T10:20:00Z",
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <Image source={{ uri: item.imgUrl }} style={styles.postImage} />
            <View style={styles.postContent}>
              <Text style={styles.authorName}>{item.authorData.name}</Text>
              <Text style={styles.postText}>{item.content}</Text>
              <Text style={styles.postTags}>Tags: {item.tags.join(", ")}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// Styles for the HomeScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  postCard: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  postContent: {
    flex: 1,
    justifyContent: "center",
  },
  authorName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  postText: {
    marginVertical: 5,
    fontSize: 14,
    color: "#333",
  },
  postTags: {
    fontSize: 12,
    color: "#666",
  },
});
