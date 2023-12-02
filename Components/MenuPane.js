import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Schedule from './Schedule';
import Notification from './Notification';
import Login from './Login';
import RegisterClass from './RegisterClass';
import Extensions from './Extensions';
import About from './About';

const Tab = createBottomTabNavigator();

const MenuPane = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { justifyContent: "center", display: 'flex'},
        tabBarStyle: { display: 'flex' },
        tabBarItemStyle: { width: 'auto' },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconSize = focused ? 30 : 20;

          if (route.name === 'Tiện ích') {
            iconName = focused ? 'apps' : 'apps-outline';
          } else if (route.name === 'Lịch học') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Thông báo') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Hồ sơ') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={iconSize} color="#000" />;
        },
      })}
    >
      <Tab.Screen name="Lịch học" component={Schedule} />
      {/* <Tab.Screen name="ĐKMH" component={RegisterClass}/> */}
      <Tab.Screen name="Tiện ích" component={Extensions}/>
      <Tab.Screen name="Thông báo" component={Notification}/>
      <Tab.Screen name="Hồ sơ" component={About}/>
    </Tab.Navigator>
  );
};

export default MenuPane;
