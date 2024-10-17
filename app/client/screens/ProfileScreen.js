import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Button } from 'react-native';

export default function ProfileScreen({ navigation }) {
  
  const [following, setFollowing] = useState([
    { id: '1', username: 'JohnDoe', profilePicture: 'https://via.placeholder.com/50' },
    { id: '2', username: 'JaneSmith', profilePicture: 'https://via.placeholder.com/50' },
  ]);

  const [followers, setFollowers] = useState([
    { id: '3', username: 'Alice', profilePicture: 'https://via.placeholder.com/50' },
    { id: '4', username: 'Bob', profilePicture: 'https://via.placeholder.com/50' },
  ]);

  const user = {
    username: 'PlaceholderUser',
    profilePicture: 'https://via.placeholder.com/150',
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Image source={{ uri: item.profilePicture }} style={styles.userImage} />
      <Text style={styles.userName}>{item.username}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Profile Data */}
      <View style={styles.topSection}>
        <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
        <Text style={styles.username}>{user.username}</Text>
      </View>

      {/* Following and Followers Lists */}
      <Text style={styles.sectionTitle}>Following</Text>
      <FlatList
        data={following}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        style={styles.list} 
      />

      <Text style={styles.sectionTitle}>Followers</Text>
      <FlatList
        data={followers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        style={styles.list} 
      />

      {/* Logout Button */}
      <Button title="Logout" color="tomato" onPress={() => navigation.replace('Login')} />
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
