import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { fonts } from '../BaseStyle/Style';

const items = [
  { title: 'ĐKMH', icon: '📚' },
  { title: 'Xem điểm', icon: '📊' },
  { title: 'Lịch thi', icon: '🗓️' },
  { title: 'Chat GPT', icon: '😂' },
  { title: 'Chương trình đào tạo', icon: '📘' },
  { title: 'Học phí', icon: '💰' },
];

const GridItem = ({ title, icon }) => (
  <TouchableOpacity style={styles.gridItem}>
    <Text style={styles.gridItemText}>{icon}</Text>
    <Text>{title}</Text>
  </TouchableOpacity>
);

const Extensions = () => (
  <View style={styles.container}>
    <View style={styles.gridContainer}>
      {items.map((item, index) => (
        <GridItem key={index} title={item.title} icon={item.icon} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    height: 100,
    marginVertical: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  gridItemText: {
    fontSize: 24,
  },
});

export default Extensions;