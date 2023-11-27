import React from 'react';
import {StyleSheet, View, Text, FlatList } from 'react-native';

const NotificationList = [
    { id: '1', title: 'Thông báo 1', content: 'Nội dung ngắn của thông báo 1' },
    { id: '2', title: 'Thông báo 2', content: 'Nội dung ngắn của thông báo 2' },
    { id: '3', title: 'Thông báo 1', content: 'Nội dung ngắn của thông báo 1' },
    { id: '4', title: 'Thông báo 2', content: 'Nội dung ngắn của thông báo 2' },
    { id: '5', title: 'Thông báo 1', content: 'Nội dung ngắn của thông báo 1' },
    { id: '6', title: 'Thông báo 2', content: 'Nội dung ngắn của thông báo 2' },
    { id: '7', title: 'Thông báo 1', content: 'Nội dung ngắn của thông báo 1' },
    { id: '8', title: 'Thông báo 2', content: 'Nội dung ngắn của thông báo 2' },
    { id: '9', title: 'Thông báo 1', content: 'Nội dung ngắn của thông báo 1' },
    { id: '10', title: 'Thông báo 2', content: 'Nội dung ngắn của thông báo 2' },
  ];
  

const Notification = () => {
    const renderItem = ({ item }) => (
        <View style={styles.notification}>
          <Text style={{color: "green", fontWeight: 'bold'}}>{item.title}</Text>
          <Text>{item.content}</Text>
        </View>
  );

  return (
    <FlatList style ={{height: 200}}
      data={NotificationList}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};
const styles = StyleSheet.create({
    notification: {
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      margin: 5,
    },
  });
export default Notification;

