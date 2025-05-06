import React from 'react';
import {NavigationView} from '@googlemaps/react-native-navigation-sdk';
import {StyleSheet, Text, View} from 'react-native';
import {usePermissions} from './usePermissions';
import {useGuidedNavigation} from './useGuidedNavigation';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const GOOGLE_MAPS_API_KEY = 'GOOGLE_MAPS_API_KEY';

export function GuidedNavigation() {
  const {arePermissionsApproved} = usePermissions();
  const {
    setMapViewController,
    setNavigationViewController,
    mapViewCallbacks,
    startNavigating,
  } = useGuidedNavigation();

  if (!arePermissionsApproved) {
    return <Text>Location Permissions are not granted</Text>;
  }

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Enter destination"
        styles={{
          container: {
            flex: 0, // Prevents full height
          },
        }}
        fetchDetails={true}
        onPress={(_data, details = null) => {
          startNavigating(details);
        }}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: 'en',
        }}
      />

      <NavigationView
        androidStylingOptions={{
          primaryDayModeThemeColor: '#34eba8',
          headerDistanceValueTextColor: '#76b5c5',
          headerInstructionsFirstRowTextSize: '20f',
        }}
        iOSStylingOptions={{
          navigationHeaderPrimaryBackgroundColor: '#34eba8',
          navigationHeaderDistanceValueTextColor: '#76b5c5',
        }}
        navigationViewCallbacks={{}}
        mapViewCallbacks={mapViewCallbacks}
        onNavigationViewControllerCreated={setNavigationViewController}
        onMapViewControllerCreated={setMapViewController}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
});
