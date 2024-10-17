import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";
import { AuthContext } from "./contexts/AuthContext";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  return (
    <AuthContext.Provider value={{isSignedIn, setIsSignedIn}}>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </ApolloProvider>
    </AuthContext.Provider>
  );
}
