import React, { useContext, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen.js";
import RegisterScreen from "../screens/RegisterScreen.js";
import TabNavigator from "./TabNavigator.js";
import PostDetailScreen from "../screens/PostDetailScreen.js";
import { AuthContext } from "../contexts/AuthContext.js";
import SearchScreen from "../screens/SearchScreen.js";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const { isSignedIn } = useContext(AuthContext);

  return (
    <>
      <Stack.Navigator initialRouteName={isSignedIn ? "HomeTabs" : "Login"}>
        {isSignedIn ? (
          <>
            <Stack.Screen
              name="HomeTabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="PostDetail" component={PostDetailScreen} />
            <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }}/>
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </>
  );
}
