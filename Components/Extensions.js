import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { fonts } from '../BaseStyle/Style';
import Icon from 'react-native-vector-icons/Ionicons';

const items = [
  { title: 'ĐKMH', icon: 'book' },
  { title: 'Xem điểm', icon: 'bar-chart' },
  { title: 'Lịch thi', icon: 'calendar' },
  { title: 'Chat GPT', icon: 'chatbubble-outline' },
  { title: 'Chương trình đào tạo', icon: 'book' },
  { title: 'Học phí', icon: 'cash-outline' },
];

const GridItem = ({ title, icon }) => (
  <TouchableOpacity style={styles.gridItem}>
    <Icon name={icon} style={styles.iconStyle} />
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
    height: 150,
    marginVertical: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  gridItemText: {
    fontSize: 24,
  },
  iconStyle: {
    color: '#0695e3',
    fontWeight: 'bold',
    fontSize: 24,
    
  },
});

export default Extensions;