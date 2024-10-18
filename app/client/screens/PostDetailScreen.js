import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
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

const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $content: String!) {
    addComment(postId: $postId, content: $content) {
      _id
      authorId
      content
      comments {
        content
        username
        createdAt
        updatedAt
      }
    }
  }
`;

const LIKE_POST = gql`
  mutation Mutation($postId: ID!) {
    likePost(postId: $postId) {
      _id
      authorId
      content
      likes {
        username
        createdAt
        updatedAt
      }
    }
  }
`;

export default function PostDetailScreen({ navigation, route }) {
  const { id } = route.params;
  const [comment, setComment] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_POST_BY_ID, {
    variables: { getPostId: id },
  });

  const [addComment] = useMutation(ADD_COMMENT, {
    onCompleted: () => {
      setComment("");
      refetch(); 
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
    },
  });

  const [likePost] = useMutation(LIKE_POST, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error liking post:", error);
    },
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const post = data.getPost;

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      addComment({
        variables: { postId: post._id, content: comment },
      });
    }
  };

  const handleLikePost = () => {
    likePost({
      variables: { postId: post._id },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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

        <TouchableOpacity style={styles.likeButton} onPress={handleLikePost}>
          <Icon name="thumbs-up" size={16} color="#fff" />
          <Text style={styles.likeCount}>{post?.likes.length} Likes</Text>
        </TouchableOpacity>

        <View style={styles.commentsContainer}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>Comments</Text>
          <ScrollView style={styles.commentsScrollView}>
            {post.comments?.length === 0 ? (
              <Text style={styles.noCommentsText}>No Comments Yet</Text>
            ) : (
              post.comments?.map((comment, index) => (
                <View key={comment.createdAt} style={styles.comment}>
                  <Image
                    source={{
                      uri: `https://picsum.photos/500/500?random=${post._id}`,
                    }}
                    style={styles.profilePic}
                  />
                  <View style={styles.commentContentContainer}>
                    <Text style={styles.commentUser}>{comment?.username}:</Text>
                    <Text style={styles.commentContent}>{comment?.content}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleCommentSubmit}
        >
          <Icon name="paper-plane" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 10,
    paddingBottom: 20,
  },
  image: {
    width: "100%",
    height: 400,
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
    marginTop: 10,
  },
  commentsScrollView: {
    maxHeight: 200, // Set a max height for the comments ScrollView
  },
  commentContentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  noCommentsText: {
    fontStyle: "italic",
    color: "gray",
    marginTop: 15,
    marginLeft: 5,
  },
  comment: {
    flexDirection: "row",
    marginVertical: 5,
  },
  commentUser: {
    fontWeight: "bold",
  },
  commentContent: {
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
