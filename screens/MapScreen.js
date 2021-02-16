import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Colors from '../constants/Colors';

const MapScreen = props => {
  const initialLocation = props.navigation.getParam('initialLocation');
  const readonly = props.navigation.getParam('readonly');

  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const mapRegion = {
    latitude: initialLocation ? initialLocation.lat : 37.78,
    longitude: initialLocation ? initialLocation.lng : -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  };

  const selectLocationHandler = event => {
    if (readonly) {
      return;
    }
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude
    });
  };

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert(
        'Pick a Location!',
        'You need to pick a location on the map to continue.',
        [{ text: 'Okay' }]
      );
      return;
    };

    props.navigation.navigate('NewPlace', {
      pickedLocation: selectedLocation
    });
  }, [selectedLocation]);

  useEffect(() => {
    props.navigation.setParams({ saveLocation: savePickedLocationHandler });
  }, [savePickedLocationHandler]);

  let markerCoordinates;

  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng
    };
  }

  return (
    <MapView
      region={ mapRegion }
      style={ styles.map }
      onPress={ selectLocationHandler }
    >
      {markerCoordinates && <Marker title="Picked Location" coordinate={ markerCoordinates }></Marker> }
    </MapView>
  );
};

MapScreen.navigationOptions = navData => {
  const saveFn = navData.navigation.getParam('saveLocation');
  const readonly = navData.navigation.getParam('readonly');

  if (readonly) {
    return {};
  }
  return {
    headerTitle: 'Pick a place on the map',
    headerRight: () => (
      <TouchableOpacity style={ styles.headerBtn } onPress={ saveFn }>
        <Text style={ styles.headerBtnText }>Save</Text>
      </TouchableOpacity>
    )
  };
};

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  headerBtn: {
    marginHorizontal: 20
  },
  headerBtnText: {
    fontSize: 16,
    color: Platform.OS === 'android' ? Colors.accent : Colors.primary
  }
});

export default MapScreen;