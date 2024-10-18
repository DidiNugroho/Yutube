import React, { useContext, useEffect, useState } from "react";  
import {  
  View,  
  Text,  
  Image,  
  StyleSheet,  
  ActivityIndicator,  
  ScrollView,  
  RefreshControl,
  Button,  
} from "react-native";  
import { AuthContext } from "../contexts/AuthContext";  
import * as SecureStore from "expo-secure-store";  
import { gql, useQuery } from "@apollo/client";  

const GET_PROFILE = gql`  
  query Query($id: ID) {  
    getUser(_id: $id) {  
      _id  
      name  
      username  
      email  
      followers {  
        _id  
        username  
        name  
      }  
      following {  
        _id  
        username  
        name  
      }  
    }  
  }  
`;  

export default function ProfileScreen({ navigation }) {  
  const { setIsSignedIn } = useContext(AuthContext);  
  const [userId, setUserId] = useState(null);  
  const [refreshing, setRefreshing] = useState(false);  

  const { data, loading, error, refetch } = useQuery(GET_PROFILE, {  
    variables: { id: userId },  
  });  

  const checkToken = async () => {  
    const token = await SecureStore.getItemAsync("access_token");  
    if (token) setIsSignedIn(true);  
  };  

  useEffect(() => {  
    if (userId) refetch();  
  }, [userId]);  

  useEffect(() => {  
    const getUserId = async () => {  
      const id = await SecureStore.getItemAsync("_id");  
      setUserId(id);  
    };  
    getUserId();  
  }, []);  

  const handleLogout = async () => {  
    await SecureStore.deleteItemAsync("access_token");  
    await SecureStore.deleteItemAsync("_id");  
    await SecureStore.deleteItemAsync("username");  
    setIsSignedIn(false);  
  };  

  const onRefresh = () => {  
    setRefreshing(true);  
    refetch().finally(() => setRefreshing(false));  
  };  

  const renderUserItem = (item) => (  
    <View key={item._id} style={styles.userItem}>  
      <Image  
        source={{ uri: `https://picsum.photos/500/500?random=${item._id}` }}  
        style={styles.userImage}  
      />  
      <Text style={styles.userName}>{item.username}</Text>  
    </View>  
  );  

  const user = data?.getUser;  

  return (  
    <View style={styles.container}>  
      {loading ? (  
        <ActivityIndicator  
          size="large"  
          color="#0000ff"  
          style={styles.loadingIndicator}  
        />  
      ) : (  
        <ScrollView  
          contentContainerStyle={styles.scrollView}  
          refreshControl={  
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />  
          }  
        >  
          <View style={styles.topSection}>  
            <Image  
              source={{  
                uri: `https://picsum.photos/500/500?random=${user._id}`,  
              }}  
              style={styles.profileImage}  
            />  
            <Text style={styles.username}>{user.username}</Text>  
          </View>  

          <Text style={styles.sectionTitle}>Following</Text>  
          <ScrollView contentContainerStyle={styles.list}>  
            {user.following.length === 0 ? (  
              <Text style={styles.noDataText}>No following yet.</Text>  
            ) : (  
              user.following.map(renderUserItem)  
            )}  
          </ScrollView>  

          <Text style={styles.sectionTitle}>Followers</Text>  
          <ScrollView contentContainerStyle={styles.list}>  
            {user.followers.length === 0 ? (  
              <Text style={styles.noDataText}>No followers yet.</Text>  
            ) : (  
              user.followers.map(renderUserItem)  
            )}  
          </ScrollView>  
        </ScrollView>  
      )}  

      <View style={styles.logoutContainer}>  
        <Button title="Logout" color="tomato" onPress={handleLogout} />  
      </View>  
    </View>  
  );  
}  

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    padding: 16,  
    backgroundColor: "#fff",  
  },  
  scrollView: {  
    flexGrow: 1,  
  },  
  logoutContainer: {  
    marginTop: 16,  
    paddingBottom: 5,  
  },  
  topSection: {  
    flexDirection: "row",  
    alignItems: "center",  
    marginBottom: 20,  
  },  
  profileImage: {  
    width: 80,  
    height: 80,  
    borderRadius: 40,  
    marginRight: 16,  
  },  
  username: {  
    fontSize: 24,  
    fontWeight: "bold",  
  },  
  sectionTitle: {  
    fontSize: 20,  
    fontWeight: "bold",  
    marginBottom: 10,  
    marginTop: 20,  
  },  
  userItem: {  
    flexDirection: "row",  
    alignItems: "center",  
    marginBottom: 10,  
  },  
  userImage: {  
    width: 50,  
    height: 50,  
    borderRadius: 25,  
    marginRight: 10,  
  },  
  userName: {  
    fontSize: 18,  
  },  
  list: {  
    marginBottom: 20,  
  },  
  noDataText: {  
    fontSize: 16,  
    color: "gray",  
    marginTop: 10,  
  },  
});