import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import MenuPane from './Components/MenuPane';
import Login from './Components/Login';
const App = () => {
  const Stack = createStackNavigator();
  return (
    
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false, gestureEnabled: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="MenuPane" component={MenuPane} options={{ gestureEnabled: false }} />
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
  );
};

export default App;