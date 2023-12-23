import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      showSuggestions: false,
      selectedLocation: null,
      query: '',
      data: [
        { name: 'Giảng đường Cát Tường', latitude: 10.873332791456356, longitude: 106.79184313863516 },
        { name: 'Giảng đường Tường Vy', latitude: 10.87366073103513, longitude: 106.79205939173698 },
        { name: 'Giảng đường Hướng Dương', latitude: 10.873932367461402, longitude: 106.79184012115002 },
        { name: 'Giảng đường Phượng Vĩ', latitude: 10.871954848623503, longitude: 106.79285936057568 },
        { name: 'Giảng đường Cẩm Tú', latitude: 10.873502, longitude: 106.791493 },
        { name: 'Giảng đường Rạng Đông', latitude: 10.870542327141935, longitude: 106.79240707308054 },
        { name: 'Khoa Công Nghệ Thông Tin', latitude: 10.87079717416942, longitude: 106.79150719195604 },
        { name: 'Bãi giữ xe', latitude: 10.870554509756735, longitude:106.79120410233736 },
      ],
    };
    this.onPressMap = this.onPressMap.bind(this);
    this.mapRef = React.createRef();
  }

  onPlaceSelected = (location) => {
    const { latitude, longitude, name } = location;

    const newMarker = {
      coordinate: { latitude, longitude },
      title: name,
      description: `Lat: ${latitude}, Lng: ${longitude}`,
    };

    this.setState({
      selectedLocation: { latitude, longitude },
      markers: [newMarker],
      query: '',
      showSuggestions: false,
    });

    this.mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0015,
      longitudeDelta: 0.0015,
    }, 1000);
  };
  onPressMap = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    console.log(`Kinh độ: ${longitude}, Vĩ độ: ${latitude}`);
    const newMarker = {
      coordinate: {
        latitude,
        longitude,
      },
      title: `Lat: ${latitude}, Lng: ${longitude}`,
      description: `Lat: ${latitude}, Lng: ${longitude}`,
    };

    this.setState({
      selectedLocation: {
        latitude,
        longitude,
      },
      markers: [newMarker],
    });
    this.mapRef.current.animateToRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.0015,
      longitudeDelta: 0.0015,
    }, 1000);
  };
  onInputChange = (text) => {
    this.setState({ showSuggestions: text.length > 0 });
  };
  render() {
    const { selectedLocation, markers, query, data,showSuggestions } = this.state;
 
    return (
      <View style={styles.container}>
        <MapView
          ref={this.mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 10.871601,
            longitude: 106.791707,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={(event) => this.onPressMap(event)}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
              pinColor={'red'}
            />
          ))}
        </MapView>

        <View style={styles.autocompleteContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.setState({ query: text }, this.onInputChange(text))}
            value={query}
            placeholder="Tìm kiếm 1 địa điểm"
          />
          {showSuggestions && (
          <FlatList
            data={data.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => this.onPlaceSelected(item)}>
                <Text style={styles.item}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
           )}
        </View>
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
  locationInfo: {
    position: 'absolute',
    top: 50,
    left: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  autocompleteContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
  },
  input: {
    borderRadius: 10,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.025)',
  },
  item: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
});

export default Map;
