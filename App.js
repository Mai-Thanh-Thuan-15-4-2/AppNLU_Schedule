import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import MenuPane from './Components/MenuPane';
import Login from './Components/Login';
import ReportBug from './Components/ReportBug';
import Profile from './Components/Profile';
import About from './Components/About';
import RegisterClass from './Components/RegisterClass';
import Score from './Components/Score';
import EducationFees from './Components/EducationFees';
import ExamsSchedule from './Components/ExamsSchedule';
import ChatGPT from './Components/ChatGPT';
import Vip from './Components/Vip';
import SettingPage from './Components/SettingPage';
const App = () => {
  const Stack = createStackNavigator();
  return (
    
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false, gestureEnabled: false }}>
          <Stack.Screen name="Login" component={Login}/>
          <Stack.Screen name="Thông tin" component={Profile} options={{headerShown: true, gestureEnabled: true }} />
          <Stack.Screen name="RegisterClass" component={RegisterClass} options={{headerShown: true, gestureEnabled: true }}/>
          <Stack.Screen name="About" component={About} options={{headerShown: true, gestureEnabled: true }}/>
          <Stack.Screen name="Xem điểm" component={Score} options={{headerShown: true, gestureEnabled: true }}/>
          <Stack.Screen name="Xem lịch thi" component={ExamsSchedule} options={{headerShown: true, gestureEnabled: true }}/>
          <Stack.Screen name="Học Phí" component={EducationFees} options={{headerShown: true, gestureEnabled: true }}/>
          <Stack.Screen name="Hỗ trợ" component={ReportBug} options={{headerShown: true, gestureEnabled: true }} />
          <Stack.Screen name="Cài đặt" component={SettingPage} options={{headerShown: true, gestureEnabled: true }} />
          <Stack.Screen name="MenuPane" component={MenuPane} options={{ gestureEnabled: false }} />
          <Stack.Screen name="ChatGPT" component={ChatGPT} options={{headerShown: true, gestureEnabled: true }} />
          <Stack.Screen name="Quyền lợi VIP" component={Vip} options={{headerShown: true, gestureEnabled: true }} />
        </Stack.Navigator>
          
        <Toast />
      </NavigationContainer>
  );
};

export default App;