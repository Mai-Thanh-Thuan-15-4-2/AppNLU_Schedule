import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { colors } from '../BaseStyle/Style';

const Profile = ({ navigation }) => {
    const handleComeBack = () => {
        navigation.goBack();
      };
    
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Thông Tin Tài Khoản</Text>

      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Mã số SV:</Text>
          <Text style={styles.value}>123456</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Họ và Tên:</Text>
          <Text style={styles.value}>Nguyen Van A</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Lớp:</Text>
          <Text style={styles.value}>DH20DT</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ngành:</Text>
          <Text style={styles.value}>CNTT</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Khoa:</Text>
          <Text style={styles.value}>CNTT</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Trường:</Text>
          <Text style={styles.value}>ĐHNL</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Năm học:</Text>
          <Text style={styles.value}>4</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Sinh Ngày:</Text>
          <Text style={styles.value}>20/04/02</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Quê Quán:</Text>
          <Text style={styles.value}>Đồng Nai</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleComeBack}>
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
 
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
  },
  infoContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  value: {},
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    width: 100,
    marginLeft: 135,
    marginTop: 20,
    alignItems: 'center',
  },
});

export default Profile;
