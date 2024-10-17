import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </ApolloProvider>
  );
}
