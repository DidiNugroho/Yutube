import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const PostCard = ({ post, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: post.imgUrl }} style={styles.postImage} />
      <View style={styles.cardContent}>
        <Image
          source={{ uri: `https://picsum.photos/500/500?random=${post._id}` }}
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.content}>{post.content}</Text>
          <Text style={styles.username}>{post.authorData.username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10, 
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    color: "#333",
  },
  content: {
    fontWeight: "bold",
    fontSize: 16,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
});

export default PostCard;
