import {
  MapViewController,
  NavigationViewController,
  MapViewCallbacks,
  TravelMode,
  DisplayOptions,
  useNavigation,
} from '@googlemaps/react-native-navigation-sdk';
import {useState, useCallback, useMemo, useEffect} from 'react';
import {connectToBLEDevice, sendDataToESP32} from '../ble-manager';
import {maneuverImageNames} from './maneuverImageNames';
import {type GooglePlaceDetail} from 'react-native-google-places-autocomplete';
import Toast from 'react-native-toast-message';
import {getCurrentLocation} from './getCurrentLocation';

const origin = getCurrentLocation();

export function useGuidedNavigation() {
  const [_mapViewController, setMapViewController] =
    useState<MapViewController | null>(null);
  const [_navigationViewController, setNavigationViewController] =
    useState<NavigationViewController | null>(null);

  const {navigationController, addListeners, removeListeners} = useNavigation();

  const onMapReady = useCallback(async () => {
    console.log('Map is ready, initializing navigator...');
    try {
      await navigationController.init();
      connectToBLEDevice();
    } catch (error) {
      console.error('Error initializing navigator', error);
    }
  }, [navigationController]);

  const onTurnByTurn = useCallback((turnByTurn: any) => {
    try {
      const step = turnByTurn[0];
      const dataToSend = {
        nextTurnInMetres: step.distanceToCurrentStepMeters,
        instruction: step.currentStep.instruction,
        distanceRemainingInMetres: step.distanceToFinalDestinationMeters,
        timeRemainingInSec: step.timeToFinalDestinationSeconds,
        maneuverImageName: `${maneuverImageNames[step.maneuver]}.png`,
      };

      // send data to BLE device
      sendDataToESP32(JSON.stringify(dataToSend));
    } catch (e) {
      console.error('Error preparing data to be sent to BLE', e);
      Toast.show({
        type: 'error',
        text1: 'Error preparing data to be sent to BLE',
      });
    }
  }, []);

  const navigationCallbacks = useMemo(
    () => ({
      onTurnByTurn,
      // Add other callbacks here
    }),
    [onTurnByTurn],
  );

  const mapViewCallbacks: MapViewCallbacks = useMemo(() => {
    return {
      onMapReady,
    };
  }, [onMapReady]);

  useEffect(() => {
    addListeners(navigationCallbacks);
    return () => {
      removeListeners(navigationCallbacks);
    };
  }, [navigationCallbacks, addListeners, removeListeners]);

  const startNavigating = async (destinationData: GooglePlaceDetail | null) => {
    if (!destinationData) {
      return;
    }

    const destination = {
      title: 'Destination',
      position: {
        lat: destinationData.geometry.location.lat,
        lng: destinationData.geometry.location.lng,
      },
    };

    const routingOptions = {
      travelMode: TravelMode.DRIVING,
      avoidFerries: false,
      avoidTolls: false,
    };

    const displayOptions: DisplayOptions = {
      showDestinationMarkers: true,
      showStopSigns: true,
      showTrafficLights: true,
    };

    try {
      await navigationController.setDestinations(
        [origin, destination],
        routingOptions,
        displayOptions,
      );

      navigationController.setTurnByTurnLoggingEnabled(true);
      navigationController.simulator.simulateLocationsAlongExistingRoute({
        speedMultiplier: 3,
      });
      await navigationController.startGuidance();
    } catch (error) {
      console.error('Error starting navigation', error);
      Toast.show({
        type: 'error',
        text1: 'Error starting navigation',
        text2: JSON.stringify(error),
      });
    }
  };

  return {
    setMapViewController,
    setNavigationViewController,
    mapViewCallbacks,
    startNavigating,
  };
}
