import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreatePostModal from '../components/CreatePostModal'; // Import the modal component
import { Ionicons } from 'react-native-vector-icons';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'CreatePost') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen
          name="CreatePost"
          component={CreatePostModal} 
          listeners={{
            tabPress: (e) => {
              e.preventDefault(); 
              openModal(); 
            },
          }}
        />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      <CreatePostModal visible={isModalVisible} onClose={closeModal} />
    </>
  );
}
