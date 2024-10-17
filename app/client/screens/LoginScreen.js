import { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { gql, useMutation } from "@apollo/client";
import * as SecureStore from 'expo-secure-store'

const LOGIN = gql`
  mutation LoginUser($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
    access_token
    username
    userId
  }
}
`;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const [login] = useMutation(LOGIN);

  const handleLogin = async () => {
    try {
      const result = await login({
        variables: {
          email,
          password
        }
      })
      const token = result.data.loginUser.access_token
      const _id = result.data.loginUser.userId
      const username = result.data.loginUser.username

      console.log(result)

      await SecureStore.setItemAsync("access_token", token)
      await SecureStore.setItemAsync("_id", _id)
      await SecureStore.setItemAsync("username", username)
      
      setIsSignedIn(true);
    } catch (error) {
      Alert.alert(error.message)
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      navigation.replace("HomeTabs");
    }
  }, [isSignedIn, navigation]);

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 20, alignItems: "center" }}>
        <Text style={styles.title}>Login</Text>
      </View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
      <View style={{ marginTop: 10 }}>
        <Button
          title="Go to Register"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  title: { fontSize: 24, fontWeight: "bold" },
});
