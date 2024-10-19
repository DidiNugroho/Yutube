import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client"; 
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator, // Import ActivityIndicator for loading indicator
} from "react-native";
import * as SecureStore from "expo-secure-store";

const SEARCH_USER = gql`
  query GetUserByNameOrUsername($name: String, $username: String) {
    getUserByNameOrUsername(name: $name, username: $username) {
      _id
      name
      username
      email
    }
  }
`;

const FOLLOW_USER = gql`
  mutation ToggleFollow($followingId: ID!) {
    toggleFollow(followingId: $followingId) {
      success
      message
      follow {
        _id
        followingId
        followerId
      }
    }
  }
`;

const GET_FOLLOWS = gql`
  query GetFollows {
    GetFollows {
      _id
      followingId
      followerId
    }
  }
`;

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loadingFollow, setLoadingFollow] = useState(false); // State for follow button loading

  const [searchUser, { loading, error }] = useLazyQuery(SEARCH_USER, {
    onCompleted: (data) => {
      if (data.getUserByNameOrUsername) {
        setSearchResults([data.getUserByNameOrUsername]);
      } else {
        setSearchResults([]);
      }
    },
  });

  const { data: followsData, refetch: refetchFollows } = useQuery(GET_FOLLOWS);

  const [toggleFollow] = useMutation(FOLLOW_USER);

  useEffect(() => {
    const getUserId = async () => {
      const id = await SecureStore.getItemAsync("_id");
      setUserId(id);
    };
    getUserId();
  }, []);

  const loggedUserId = userId;

  const handleSearch = () => {
    const nameOrUsername = query.trim();
    if (nameOrUsername) {
      searchUser({
        variables: {
          name: nameOrUsername,
          username: nameOrUsername,
        },
      });
    }
  };

  const handleFollow = async (userId) => {
    try {
      setLoadingFollow(true); // Start loading when follow button is pressed
      const { data } = await toggleFollow({
        variables: { followingId: userId },
      });

      if (data.toggleFollow.success) {
        await refetchFollows();
        alert(data.toggleFollow.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to follow/unfollow the user.");
    } finally {
      setLoadingFollow(false); // Stop loading after follow operation is done
    }
  };

  const isFollowing = (userId) => {
    return followsData?.GetFollows?.some(
      (follow) => follow.followerId === loggedUserId && follow.followingId === userId
    );
  };

  const renderUserItem = (item) => (
    <View key={item._id} style={styles.userItem}>
      <Image
        source={{ uri: `https://picsum.photos/500/500?random=${item._id}` }}
        style={styles.userImage}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userUsername}>{item.username}</Text>
      </View>
      <TouchableOpacity
        style={[styles.followButton, isFollowing(item._id) ? styles.followingButton : null]}
        onPress={() => handleFollow(item._id)}
        disabled={loadingFollow} // Disable button while loading
      >
        {loadingFollow ? (
          <ActivityIndicator size="small" color="#fff" /> // Show loading indicator
        ) : (
          <Text style={styles.followButtonText}>
            {isFollowing(item._id) ? "Unfollow" : "Follow"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 35 }}>
      <TextInput
        placeholder="Search user..."
        value={query}
        onChangeText={setQuery}
        style={{
          borderWidth: 1,
          borderColor: "gray",
          padding: 10,
          marginBottom: 20,
        }}
      />
      <Button title="Search" onPress={handleSearch} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text>Error: {error.message}</Text>}

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => renderUserItem(item)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userUsername: {
    fontSize: 16,
    color: "gray",
  },
  followButton: {
    backgroundColor: "#007BFF",
    padding: 8,
    borderRadius: 5,
  },
  followingButton: {
    backgroundColor: "black",
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SearchScreen;
