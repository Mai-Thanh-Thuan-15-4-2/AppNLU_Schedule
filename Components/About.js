import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../BaseStyle/Style';

const About = () => {
  const navigation = useNavigation();

  const handleViewProfile = () => {
    // Điều hướng đến màn hình xem thông tin tài khoản
    navigation.navigate('Thông tin');
  };

  const handleLogout = () => {
    // Thực hiện logic đăng xuất ở đây
    // Sau khi đăng xuất, chuyển về màn hình đăng nhập hoặc màn hình chính
  };

  const handleReportBug = () => {
    // Điều hướng đến màn hình báo cáo lỗi
    navigation.navigate('Hỗ trợ');
  };

  return (
    <View style={styles.container}>
      {/* Item Xem thông tin tài khoản */}
      <TouchableOpacity style={styles.item} onPress={handleViewProfile}>
        <Icon name="person" style={styles.icon} />
        <Text style={styles.itemText}>Thông tin</Text>
      </TouchableOpacity>

      {/* Item Báo cáo lỗi */}
      <TouchableOpacity style={styles.item} onPress={handleReportBug}>
        <Icon name="bug" style={styles.icon} />
        <Text style={styles.itemText}>Hỗ trợ</Text>
      </TouchableOpacity>
      {/* Item VIP */}
      <TouchableOpacity style={styles.item} onPress={handleLogout}>
        <Icon name="star" style={styles.icon_vip} />
        <Text style={styles.itemText}>VIP Member</Text>
      </TouchableOpacity>
      {/* Item Đăng xuất */}
      <TouchableOpacity style={styles.item} onPress={handleLogout}>
        <Icon name="log-out" style={styles.icon_logout} />
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundColor,
    padding: 16,
    marginTop: 24,
    marginVertical: 50,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    height: 150,
    width: 150,
  },
  itemText: {
    marginTop: 8,
  },
  icon: {
    fontSize: 50,
    color: colors.primary,
  },
  icon_logout: {
    fontSize: 50,
    color: colors.dangerous,
  },
  icon_vip: {
    fontSize: 50,
    color: colors.vip,
  }
});

export default About;
