import React from "react";
import { gql, useQuery } from "@apollo/client";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; 

const GET_POST_BY_ID = gql`
  query GetPost($getPostId: ID!) {
    getPost(id: $getPostId) {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
      }
      likes {
        username
        createdAt
      }
      createdAt
      updatedAt
      authorData {
        _id
        name
        username
        email
      }
    }
  }
`;

export default function PostDetailScreen({ navigation, route }) {
  const { id } = route.params;
  const { loading, error, data } = useQuery(GET_POST_BY_ID, {
    variables: { getPostId: id },
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const post = data.getPost;

  return (
    <ScrollView style={styles.container}>
      {post?.imgUrl && (
        <Image source={{ uri: post?.imgUrl }} style={styles.image} />
      )}
      <Text style={styles.title}>{post?.content}</Text>
      
      <View style={styles.userInfo}>
        <Image 
          source={{ uri: `https://picsum.photos/500/500?random=${post._id}` }}
          style={styles.profilePic} 
        />
        <Text style={styles.username}>{post?.authorData.username}</Text>
      </View>

      <TouchableOpacity style={styles.likeButton}>
        <Icon name="thumbs-up" size={16} color="#fff" />
        <Text style={styles.likeCount}>{post?.likes.length} Likes</Text> 
      </TouchableOpacity>

      <View style={styles.commentsContainer}>
        {post.comments?.map((comment, index) => (
          <View key={index} style={styles.comment}>
            <Text style={styles.commentUser}>{comment?.username}:</Text>
            <Text style={styles.commentContent}>{comment?.content}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
  },
  likeButton: {
    backgroundColor: "black",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  likeCount: {
    color: "#fff",
    marginLeft: 5, 
  },
  commentsContainer: {
    marginTop: 20,
  },
  comment: {
    marginVertical: 5,
  },
  commentUser: {
    fontWeight: "bold",
  },
  commentContent: {
    marginLeft: 5,
  },
});
