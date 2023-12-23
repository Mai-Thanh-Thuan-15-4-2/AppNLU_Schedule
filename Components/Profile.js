
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { colors, loadPage } from '../BaseStyle/Style';
import { getInfoStudent } from '../service/NLUApiCaller';
import { getUser } from '../service/NLUAppApiCaller';
import User from '../model/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Profile = ({ navigation }) => {
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(new User('', '', true, false, null, ''));
  useEffect(() => {
    const fetchProfileData = async () => {

      setIsLoading(true)
      const data = await getInfoStudent();
      setProfileData(data);

      AsyncStorage.getItem('id').then(id => {
        getUser(id).then(u => {
          setUser(u);
        })
      })

      setIsLoading(false)

    };

    fetchProfileData();
  }, []);
  return (
    <View style={styles.container}>
      {user.isVip ? (
        <View style={styles.container_img}>
         <View style={[styles.circleContainer, {borderColor: colors.vip}]}>
         <Icon name='crown' style={styles.crown} />
         <Icon name='user' style={styles.avatar} />

        </View>
        
        <Text style={styles.labelVip}>VIP</Text>
       </View>
      ) : (
        <View style={styles.container_img}>
        <View style={[styles.circleContainer, {borderColor: colors.black}]}>
        <Icon name='user' style={styles.avatar} />
       </View>
      </View>
      )}
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
  container_img: {
    marginBottom: 16,
    alignItems: 'center',
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
  labelVip: {
    marginTop: 12,
    fontWeight: 'bold',
    marginRight: 8,
    color: colors.vip,
    fontSize: 19,
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
  circleContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderStyle: 'solid',
    justifyContent:'center',
  },
  crown: {
    position: 'absolute',
    zIndex: 1,
    top: -12,
    right: -10,
    color: colors.vip, 
    fontSize: 30,
    transform: [{ rotate: '35deg' }],
  },
  avatar: {
    color: colors.black, 
    fontSize: 70,
    textAlign:'center',
  },
});

export default Profile;
