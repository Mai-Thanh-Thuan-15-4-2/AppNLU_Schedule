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
        { name: 'Trung tâm Ngoại Ngữ', latitude: 10.871480501654855, longitude:106.78914621503975 },
        { name: 'Trung tâm Tin Học', latitude: 10.869604061225752,  longitude:106.78814128741912, },
        { name: 'Sân đa môn', latitude: 10.87028443317356,   longitude:106.7896083982869, },
        { name: 'Nhà thi đấu', latitude: 10.868416741753983, longitude:106.79026044754, },
        { name: 'Khoa khoa học', latitude: 10.872558998736967, longitude:106.79284147588761,},
        { name: 'Khoa thủy sản', latitude: 10.872092943189916, longitude:106.79280236236167 },
        { name: 'Khoa kinh tế', latitude: 10.87177574319569,  longitude:106.79283279389563 },
        { name: 'Nhà điều hành Thiên Lý', latitude: 10.87175843382546,   longitude:106.79177582698638  },
        { name: 'Khoa cơ khí - công nghệ', latitude: 10.873517502731309,longitude: 106.79054471148699 },
        { name: 'Trại thực nghiệm khoa Nông Học', latitude: 10.873763680022455,  longitude:106.7896730355467 },
        { name: 'Khoa môi trường - tài nguyên', latitude: 10.872085760180974,    longitude:106.78775902936479 },
        { name: 'Sân bóng cỏ nhân tạo', latitude: 10.869242980249439, longitude: 106.7902226147452},
        { name: 'Vườn ươm khoa Lâm nghiệp', latitude: 10.873592882906385,    longitude:106.79011611030457 },
        { name: 'Khoa công nghệ hóa học và thực phẩm', latitude: 10.873573644921153,  longitude:106.79150546076104  },
        { name: 'Xưởng thực hành ô tô', latitude: 10.87366735201955,   longitude:106.79075845612763 },
        { name: 'Khoa Lâm nghiệp', latitude: 10.873865475507417,    longitude:106.7937710114737},
        { name: 'Khoa khoa học sinh học', latitude: 10.874028793413727,  longitude: 106.79430263893241},
        { name: 'Viện nghiên cứu Công nghệ Sinh học và Môi trường', latitude: 10.874518746608432, longitude:106.79361016018171 },
        { name: 'Phòng Chẩn đoán bệnh cây (RIBE-PDDC)', latitude: 10.875257690884473,   longitude:106.79372193824754  },
        { name: 'TT Năng Lượng và Máy Nông nghiệp', latitude: 10.872970951294516,  longitude: 106.79026284598922 },
        { name: 'Cổng chào Đại học Nông Lâm Tp. Hồ Chí Minh', latitude: 10.867545834349691,    longitude:106.78838604221006 },
        { name: 'KTX Cỏ May', latitude: 10.870060611148805,   longitude:106.79018499261761  },
        { name: 'Cư xá A', latitude: 10.871423933885778, longitude: 106.79108232323793,  },
        { name: 'Cư xá B', latitude: 10.871375801906384,    longitude:106.78994929060613, },
        { name: 'Cư xá C', latitude: 10.87132200733237,   longitude:106.78963792287148  },
        { name: 'Cư xá D', latitude: 10.870614183072481,   longitude:106.78915645605525  },
        { name: 'Cư xá E', latitude: 10.87028443317356,   longitude:106.7896083982869, },
        { name: 'Cư xá F', latitude: 10.87064815867383,   longitude: 106.7902548922587  },
        { name: 'Bến xe buýt ĐH Nông Lâm', latitude: 10.86812262832386,    longitude: 106.78766304405508  },
        { name: 'Thư viện', latitude:10.870778398455384,longitude:  106.791575322208  },
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
