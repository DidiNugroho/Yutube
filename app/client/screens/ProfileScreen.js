import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Button, ActivityIndicator } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import * as SecureStore from 'expo-secure-store'
import { gql, useQuery } from '@apollo/client';

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
  const [userId, setUserId] = useState("null");

  const { data, loading, error, refetch } = useQuery(GET_PROFILE, {
    variables: { id: userId }
  });

  const [following, setFollowing] = useState([
    { id: '1', username: 'JohnDoe', profilePicture: 'https://via.placeholder.com/50' },
    { id: '2', username: 'JaneSmith', profilePicture: 'https://via.placeholder.com/50' },
  ]);

  const [followers, setFollowers] = useState([
    { id: '3', username: 'Alice', profilePicture: 'https://via.placeholder.com/50' },
    { id: '4', username: 'Bob', profilePicture: 'https://via.placeholder.com/50' },
  ]);

  const checkToken = async () => {
    const token = await SecureStore.getItemAsync("access_token")
    if(token) {
      setIsSignedIn(true);
    }
  }

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId]);

  useEffect(() => {
    const getUserId = async () => {
      const id = await SecureStore.getItemAsync('_id');
      setUserId(id);
    };
    getUserId();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("access_token")
    await SecureStore.deleteItemAsync("_id")
    await SecureStore.deleteItemAsync("username")
    setIsSignedIn(false)
  }

  useEffect(() => {
    checkToken()
  }, [])

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Image source={{ uri: `https://picsum.photos/500/500?random=${item._id}` }} style={styles.userImage} />
      <Text style={styles.userName}>{item.username}</Text>
    </View>
  );

  const user = data?.getUser; 

  return (
    <View style={styles.container}>
      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      ) : (
        <>
          {/* Profile Data */}
          <View style={styles.topSection}>
            <Image source={{ uri: `https://picsum.photos/500/500?random=${user._id}` }} style={styles.profileImage} />
            <Text style={styles.username}>{user.username}</Text>
          </View>

          {/* Following and Followers Lists */}
          <Text style={styles.sectionTitle}>Following</Text>
          <FlatList
            data={user.following}
            renderItem={renderUserItem}
            keyExtractor={(item) => item._id}
            style={styles.list}
          />

          <Text style={styles.sectionTitle}>Followers</Text>
          <FlatList
            data={user.followers} 
            renderItem={renderUserItem}
            keyExtractor={(item) => item._id}
            style={styles.list}
          />
  
          {/* Logout Button */}
          <Button title="Logout" color="tomato" onPress={handleLogout} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20, 
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
});
