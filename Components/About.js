import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
      {/* Nút để xem thông tin tài khoản */}
      <TouchableOpacity style={styles.button} onPress={handleViewProfile}>
        <Text>Thông tin</Text>
      </TouchableOpacity>
      {/* Nút để báo cáo lỗi */}
      <TouchableOpacity style={styles.button} onPress={handleReportBug}>
        <Text>Báo lỗi</Text>
      </TouchableOpacity>
      {/* Nút để đăng xuất */}
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text>Đăng xuất</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#e0e0e0',
    padding: 50,
    marginVertical: 10,
    borderRadius: 8,
  },
});

export default About;
