
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, loadPage } from '../BaseStyle/Style';
import { FlatList } from 'react-native-gesture-handler';
import { getInfoStudent } from '../service/NLUApiCaller';

const Profile = ({ navigation }) => {
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchProfileData = async () => {

      // setIsLoading(true)
      const data = await getInfoStudent();
      console.log(data);
      setProfileData(data);

      // setIsLoading(false)

    };

    fetchProfileData();
  }, []);
  return (
    <View style={styles.container}>
          <View style={styles.infoContainer}>
            <View style={styles.row}>
              <Text style={styles.label}>Mã số SV:</Text>
              <Text style={styles.value}>{profileData.id}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Họ và Tên:</Text>
              <Text style={styles.value}>{profileData.name}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Lớp:</Text>
              <Text style={styles.value}>{profileData.classes}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Ngành:</Text>
              <Text style={styles.value}>{profileData.majors}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Khoa:</Text>
              <Text style={styles.value}>{profileData.department}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Trường:</Text>
              <Text style={styles.value}>{profileData.school}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Năm học:</Text>
              <Text style={styles.value}>{profileData.year}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Sinh Ngày:</Text>
              <Text style={styles.value}>{profileData.birthday}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Quê Quán:</Text>
              <Text style={styles.value}>{profileData.country}</Text>
            </View>
          </View>
   
      {isLoading ? (
        <View style={loadPage.loadingContainer}>
          <ActivityIndicator size="large" color="#2bc250" />
        </View>) : (<></>)
      }
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
