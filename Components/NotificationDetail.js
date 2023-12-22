import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { getNotification } from '../service/NLUApiCaller';


class NotificationDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notification: null,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.fetchNotification();
  }

fetchNotification = async () => {
  const { idNotification } = this.props.route.params;
  const notification = await getNotification(idNotification);
  this.setState({ notification, isLoading: false });
};


  render() {
    const { isLoading, notification } = this.state;

    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (!notification) {
      return (
        <View style={styles.container}>
          <Text>Thông báo không tồn tại hoặc không thể tải được.</Text>
        </View>
      );
    }

    return (
      <WebView
        originWhitelist={['*']}
        source={{ html: notification.content }}
        style={{ flex: 1 }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationDetail;
