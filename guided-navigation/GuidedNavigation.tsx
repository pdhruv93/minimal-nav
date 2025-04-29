import React from 'react';
import {NavigationView} from '@googlemaps/react-native-navigation-sdk';
import {Button, StyleSheet, Text, View} from 'react-native';
import {usePermissions} from './usePermissions';
import {useGuidedNavigation} from './useGuidedNavigation';

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
      <Button onPress={() => startNavigating()} title="Start Nav" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
