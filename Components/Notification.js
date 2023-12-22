import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getNotifications } from '../service/NLUApiCaller';

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationList: [],
    };
  }

  componentDidMount() {
    this.fetchNotifications();
  }

  fetchNotifications = async () => {
    const notifications = await getNotifications();
    if (notifications) {
      const updatedNotifications = notifications.map((notification, index) => {
        const isNew = index < 10; 
        return { ...notification, isNew };
      });
      this.setState({ notificationList: updatedNotifications });
    }
    
  };

  isNewNotification = (uploadDate) => {
    const currentTime = new Date();
    const uploadTime = new Date(uploadDate);
    return (currentTime - uploadTime) < 24 * 60 * 60 * 1000; // 24 giờ
  };

  handlePress = (id) => {
    const { navigation } = this.props;
    navigation.navigate('Thông Báo Chi Tiết', { idNotification: id });
    
   
  };

  

renderItem = ({ item }) => (
  
  <TouchableOpacity
    style={styles.notification}
    onPress={() => this.handlePress(item.id)}
  >
    <Text style={{ color: "#0D1282", fontWeight: 'bold' }}>
      {item.title} <Text> </Text>
      {item.isNew && <Text style={styles.newLabel}>New</Text>}
    </Text>
    <View style={styles.uploadTime}>
      <Text style={{fontWeight: 'bold'}}>Ngày đăng: </Text>
      <Text style={styles.dateText}>{this.formatDate(item.uploadDate)}</Text>
     
    </View>
    <Text>{item.content}</Text>
  </TouchableOpacity>
);
  
  formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  

  render() {
    const { notificationList } = this.state;
    return (
      <FlatList
        data={notificationList}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        
      />
      
    );
    
  }
}

const styles = StyleSheet.create({
  notification: {
    backgroundColor: '#F5EFE7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 10,
    padding: 10,
    margin: 5,
    justifyContent: 'center'
  },
  newLabel: {
    position: 'absolute', 
    top: 0,             
    right: 0,      
    backgroundColor: 'yellow',
    color: 'red',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#555',
    fontSize: 12,
    marginTop: 2,
  },
  uploadTime:{
    flexDirection: 'row', 
    alignItems: 'center',
    marginLeft: 0, 
    display: 'flex',
  },
});

export default Notification;
