import React, { useState } from 'react';
import { View, TextInput, Button, Text, FlatList, StyleSheet } from 'react-native';

const dummyUsers = [
  { id: '1', name: 'John Doe', username: 'johndoe' },
  { id: '2', name: 'Jane Smith', username: 'janesmith' },
  { id: '3', name: 'Michael Johnson', username: 'mikejohnson' },
  { id: '4', name: 'Emily Davis', username: 'emilydavis' },
];

export default function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleSearch = () => {
    const results = dummyUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for users..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.input}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={filteredUsers}
        keyExtractor={user => user.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userName}>{item.name} (@{item.username})</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 },
  userItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: 'lightgray' },
  userName: { fontSize: 16 },
});
