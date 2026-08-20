import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dashboard } from './src/screens/Dashboard';
import { Inventory } from './src/screens/Inventory';
import { Waste } from './src/screens/Waste';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#0f172a',
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen 
          name="Dashboard" 
          component={Dashboard} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Inventory" 
          component={Inventory} 
          options={{ title: 'Quick Stock' }}
        />
        <Stack.Screen 
          name="Waste" 
          component={Waste} 
          options={{ title: 'Record Waste' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
