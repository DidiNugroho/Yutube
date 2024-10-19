import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

const REGISTER = gql`
  mutation RegisterUser(
    $name: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    registerUser(
      name: $name
      username: $username
      email: $email
      password: $password
    ) {
      email
      name
      username
    }
  }
`;

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerUser, { loading }] = useMutation(REGISTER, {
    onCompleted: () => {
      navigation.replace("Login");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleRegister = async () => {
    if (!name || !username || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await registerUser({
        variables: { name, username, email, password },
      });
    } catch (e) {
      console.error("Registration error", e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 20, alignItems: "center" }}>
        <Entypo name="youtube" size={50} color="black" />
        <Text style={styles.title}>Register</Text>
      </View>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
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

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Pressable style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>

          <Pressable
            style={[styles.button, { marginLeft: 10 }]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Back to Login</Text>
          </Pressable>
        </View>
      )}
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
    paddingHorizontal: 15,
    alignItems: "center",
    width: "50%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: { fontSize: 24, fontWeight: "bold" },
});
