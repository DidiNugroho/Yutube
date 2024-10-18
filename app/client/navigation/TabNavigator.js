import React, { useState } from 'react';  
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';  
import { TouchableOpacity } from 'react-native';  
import HomeScreen from '../screens/HomeScreen';  
import ProfileScreen from '../screens/ProfileScreen';  
import CreatePostModal from '../components/CreatePostModal';  
import { Ionicons } from 'react-native-vector-icons';  

const Tab = createBottomTabNavigator();  

export default function TabNavigator({navigation}) {  
  const [isModalVisible, setModalVisible] = useState(false);  

  const openModal = () => setModalVisible(true);  
  const closeModal = () => setModalVisible(false);  
  const openSearchModal = () => setSearchVisible(true);  

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
          headerRight: () => (  
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>  
              <Ionicons name="search" size={24} color="black" style={{ marginRight: 15 }} />  
            </TouchableOpacity>  
          ),  
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