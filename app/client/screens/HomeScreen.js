import React from "react";  
import { View, Text, Image, FlatList, StyleSheet } from "react-native";  
import { useQuery, gql } from '@apollo/client';  

const GET_POSTS = gql`  
  query GetAllPosts {  
    getAllPosts {  
      _id  
      content  
      tags  
      imgUrl  
      authorId  
      comments {  
        content  
        username  
        createdAt  
        updatedAt  
      }  
      likes {  
        username  
        createdAt  
        updatedAt  
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

export default function HomeScreen({ navigation }) {  
  const { loading, error, data } = useQuery(GET_POSTS);  

  if (loading) return <Text>Loading...</Text>;  
  if (error) return <Text>Error: {error.message}</Text>;  

  return (  
    <View style={styles.container}>  
      <FlatList  
        data={data?.getAllPosts}  
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