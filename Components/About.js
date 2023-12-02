import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../BaseStyle/Style';

const About = () => {
  const navigation = useNavigation();

  const handleViewProfile = () => {
    // Điều hướng đến màn hình xem thông tin tài khoản
    navigation.navigate('Profile');
  };

  const handleLogout = () => {
    // Thực hiện logic đăng xuất ở đây
    // Sau khi đăng xuất, chuyển về màn hình đăng nhập hoặc màn hình chính
  };

  const handleReportBug = () => {
    // Điều hướng đến màn hình báo cáo lỗi
    navigation.navigate('ReportBug');
  };

  return (
    <View style={styles.container}>
    {/* Item Xem thông tin tài khoản */}
    <TouchableOpacity style={styles.item} onPress={handleViewProfile}>
      <Icon name="information-circle" style={styles.icon} />
      <Text style={styles.itemText}>Thông tin</Text>
    </TouchableOpacity>

    {/* Item Báo cáo lỗi */}
    <TouchableOpacity style={styles.item} onPress={handleReportBug}>
      <Icon name="bug" style={styles.icon}  />
      <Text style={styles.itemText}>Báo lỗi</Text>
    </TouchableOpacity>

    {/* Item Đăng xuất */}
    <TouchableOpacity style={styles.item} onPress={handleLogout}>
      <Icon name="log-out" style={styles.icon_logout}  />
      <Text style={styles.itemText}>Đăng xuất</Text>
    </TouchableOpacity>
  </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
    height: 150,
    width: 150,
  },
  itemText: {
    marginTop: 8,
  },
  icon: {
    fontSize: 30,
    color: colors.primary,
  },
  icon_logout:{
    fontSize: 30,
    color: colors.dangerous,
  }
});

export default About;
