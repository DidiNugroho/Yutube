import React from "react";  
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";  
import { useQuery, gql } from '@apollo/client';  
import PostCard from "../components/PostCard";  

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
  const { data, loading, error, refetch } = useQuery(GET_POSTS);  

  const handlePostPress = (postId) => {  
    navigation.navigate('PostDetail', { id: postId });  
  };  

  if(loading) {  
    return (  
      <View style={styles.loading}>  
        <ActivityIndicator size="large" color="tomato"/>  
        <Text>Loading...</Text>   
      </View>  
    )  
  }  

  return (  
    <View style={styles.container}>  
      <FlatList  
        data={data?.getAllPosts}  
        keyExtractor={(item) => item._id}  
        renderItem={({ item }) => (  
          <PostCard   
            post={item}   
            onPress={() => handlePostPress(item._id)}  
          />  
        )}  
        refreshControl={  
          <RefreshControl  
            refreshing={loading}  
            onRefresh={() => refetch()} 
          />  
        }  
      />  
    </View>  
  );  
}  

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    backgroundColor: "#fff",  
  },  
  loading: {  
    justifyContent: "center",  
    alignItems: "center",  
    flex: 1  
  }  
});