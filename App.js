import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MenuPane from './Components/MenuPane';
const App = () => {
  return (
    <NavigationContainer>
      <MenuPane />
    </NavigationContainer>
  );
};

export default App;