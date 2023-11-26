import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // Sử dụng thư viện này để tạo biểu tượng

// Giả sử bạn đã tạo các màn hình này
import Schedule from './Schedule';

const Tab = createBottomTabNavigator();

const MenuPane = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { display: 'flex' },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconSize = focused ? 30 : 20; // Kích thước của biểu tượng sẽ tăng lên 30 khi được chọn

          if (route.name === 'Tiện ích') {
            iconName = focused ? 'apps' : 'apps-outline';
          } else if (route.name === 'Lịch học') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Thông báo') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Hồ sơ') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // Bạn có thể trả về bất kỳ thành phần nào ở đây!
          return <Icon name={iconName} size={iconSize} color="#000" />;
        },
      })}
    >
      <Tab.Screen name="Tiện ích" component={Schedule} />
      <Tab.Screen name="Lịch học" component={Schedule} />
      <Tab.Screen name="Thông báo" component={Schedule} />
      <Tab.Screen name="Hồ sơ" component={Schedule} />
    </Tab.Navigator>
  );
};

export default MenuPane;
