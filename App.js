import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ResProfileScreen from './screens/ResProfileScreen';
import CommunityAddUserScreen from './screens/CommunityAddUserScreen';
import CommunityRegisterScreen from './screens/CommunityRegisterScreen';
import CommunityProfileScreen from './screens/CommunityProfileScreen';
import EventDetailsScreen from './screens/EventDetailsScreen';
import CommunityEventRequestScreen from './screens/CommunityEventRequestScreen' 
import CommunityManageUsersScreen from './screens/CommunityManageUsersScreen'
import CommunityManagerHomeScreen from './screens/CommunityManagerHomeScreen'  
import ResFeedbackScreen from './screens/ResFeedbackScreen';
import CommunityLogInScreen from './screens/CommunityLogInScreen';
import CommunitySignUpScreen from './screens/CommunitySignUpScreen';
import CommunityEventsScreen from './screens/CommunityEventsScreen';
import EventSongDetailScreen from './screens/EventSongDetailScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const EventsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Community Events" component={CommunityEventsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Event Details" component={EventDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Song Information" component={EventSongDetailScreen} />
      <Stack.Screen name="Feedback" component={ResFeedbackScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Community Register" component={CommunityRegisterScreen} options={{ headerShown: false }} />
   
    </Stack.Navigator>
  );
};

const ManagerStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Manager Home" component={CommunityManagerHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Manage Users" component={CommunityManageUsersScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Event Request" component={CommunityEventRequestScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Community Profile" component={CommunityProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Add Users" component={CommunityAddUserScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Community Events" component={CommunityEventsScreen} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
};

const BottomTab = () =>{
  const Tab = createBottomTabNavigator();

  return(
    <Tab.Navigator>
        <Tab.Screen name="Events" component={EventsStack} options={{
          headerShown: false,
          tabBarLabel: 'Events',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-check" color={color} size={size} />
          ),
        }}
        />
        <Tab.Screen name="Profile" component={ResProfileScreen} options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
        />
        <Tab.Screen name="Manager" component={ManagerStack} options={{
          headerShown: false,
          tabBarLabel: 'Manager Page',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-tie" color={color} size={size} />
          ),
        }}
        />
      </Tab.Navigator>
  )
}


const App = () => {
  return (

    <NavigationContainer>
    <Stack.Navigator>
    <Stack.Screen name="Login" component={CommunityLogInScreen} options={{headerShown:false}}/>
    <Stack.Screen name="Register" component={CommunitySignUpScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="User BottomTab" component={BottomTab} options={{headerShown:false}}/>
  </Stack.Navigator>
  </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});