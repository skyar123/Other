import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import DashboardScreen from './src/screens/DashboardScreen';
import FamilyListScreen from './src/screens/FamilyListScreen';
import FamilyDetailScreen from './src/screens/FamilyDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F7F6F3' }
      }}
    >
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      <Stack.Screen name="FamilyDetail" component={FamilyDetailScreen} />
    </Stack.Navigator>
  );
}

function FamiliesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F7F6F3' }
      }}
    >
      <Stack.Screen name="FamilyList" component={FamilyListScreen} />
      <Stack.Screen name="FamilyDetail" component={FamilyDetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#1E3A5F',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            paddingTop: 8,
            paddingBottom: 8,
            height: 60
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 4
          }
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardStack}
          options={{
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <TabIcon icon="📊" color={color} size={size} />
            )
          }}
        />
        <Tab.Screen
          name="Families"
          component={FamiliesStack}
          options={{
            tabBarLabel: 'Families',
            tabBarIcon: ({ color, size }) => (
              <TabIcon icon="👨‍👩‍👧" color={color} size={size} />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function TabIcon({ icon, color, size }) {
  return (
    <div style={{ fontSize: size }}>{icon}</div>
  );
}
