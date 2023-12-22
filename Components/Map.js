import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
    };
  }

  onPlaceSelected = (data, details = null) => {
    console.log("Selected Place Data: ", data);
    console.log("Selected Place Details: ", details);
    const { geometry } = details;
    const { location } = geometry;
    const { lat, lng } = location;

    const newMarker = {
      coordinate: {
        latitude: lat,
        longitude: lng,
      },
      title: details.name,
      description: details.formatted_address,
    };

    this.setState((prevState) => ({
      markers: [...prevState.markers, newMarker],
    }));
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={{
            latitude: 10.871601,
            longitude: 106.791707,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {this.state.markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
            />
          ))}
        </MapView>

        <GooglePlacesAutocomplete
          placeholder="Tìm kiếm"
          onPress={this.onPlaceSelected}
          query={{
            key: 'AIzaSyBAsQCKjWH6C3kGWzzJCxUF07eztjCVQRY',
            language: 'vi', 
          }}
          fetchDetails={true}
          styles={{
            container: {
              position: 'absolute',
              top: 10,
              left: 10,
              right: 10,
            },
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;
