import React, { Component } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { WebView } from 'react-native-webview';

class Map extends Component {
  componentDidMount() {
    this.checkURL('https://maps.google.com/?ll=10.871601,106.791707&z=17&t=k');
  }

  checkURL = async (url) => {
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      console.log("Can't handle url: " + url);
    } else {
      this.setState({ url });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state?.url && (
          <WebView
            source={{ uri: this.state.url }}
            style={styles.webview}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default Map;
