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
      };

      // send data to BLE device
      sendDataToESP32(JSON.stringify(dataToSend));
    } catch (e) {
      console.error('Error preparing data to be sent to BLE', e);
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

  const startNavigating = async () => {
    try {
      const origin = {
        title: 'Origin',
        position: {
          lat: 60.284821593340155,
          lng: 24.95173610574237,
        },
      };

      const destination = {
        title: 'Destination',
        position: {
          lat: 60.2407165525624,
          lng: 24.869499072862858,
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

      await navigationController.setDestinations(
        [origin, destination],
        routingOptions,
        displayOptions,
      );

      navigationController.setTurnByTurnLoggingEnabled(true);
      await navigationController.startGuidance();
      navigationController.simulator.simulateLocationsAlongExistingRoute({
        speedMultiplier: 3,
      });
    } catch (error) {
      console.error('Error starting navigation', error);
    }
  };

  return {
    setMapViewController,
    setNavigationViewController,
    mapViewCallbacks,
    startNavigating,
  };
}
