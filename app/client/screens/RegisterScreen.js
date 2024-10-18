import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from "react-native";

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

  const [registerUser, { loading, error }] = useMutation(REGISTER, {  
    onCompleted: () => {  
      navigation.replace("Login");  
    },  
    onError: (error) => {  
      setErrorMessage(error.message);
    }
  });

  const handleRegister = async () => {
    if (!name || !username || !email || !password) {  
      alert("Please fill in all fields.");  
      return;  
    }

    try {  
      await registerUser({  
        variables: {  
          name,  
          username,  
          email,  
          password  
        }  
      });  
    } catch (e) {  
      console.error("Registration error", e);  
    }  
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 20, alignItems: "center" }}>
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
        <Button title="Register" onPress={handleRegister} />  
      )}

      <View style={{ marginTop: 10 }}>
        <Button
          title="Back to Login"
          onPress={() => navigation.navigate("Login")}
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
