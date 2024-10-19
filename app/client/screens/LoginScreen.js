import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { gql, useMutation } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import Entypo from "@expo/vector-icons/Entypo";

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
          password,
        },
        fetchPolicy: "network-only",
      });
      const token = result.data.loginUser.access_token;
      const _id = result.data.loginUser.userId;
      const username = result.data.loginUser.username;

      await SecureStore.setItemAsync("access_token", token);
      await SecureStore.setItemAsync("_id", _id);
      await SecureStore.setItemAsync("username", username);

      setIsSignedIn(true);
    } catch (error) {
      Alert.alert(error.message);
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
        <Entypo name="youtube" size={50} color="black" />
        <Text style={styles.title}>Log in to your account</Text>
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Pressable
          style={[styles.button, { marginRight: 5 }]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Pressable
          style={[styles.button, { marginLeft: 5 }]}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 25 },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 15,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    width: "50%",
    alignSelf: "center",
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: { fontSize: 24, fontWeight: "bold" },
});
