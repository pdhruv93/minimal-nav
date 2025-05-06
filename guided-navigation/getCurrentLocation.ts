import Geolocation from '@react-native-community/geolocation';
import Toast from 'react-native-toast-message';

export function getCurrentLocation() {
  let origin = {};

  Geolocation.getCurrentPosition(
    position => {
      origin = {
        title: 'Origin',
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      };
    },
    error => {
      console.error(error.code, error.message);
      Toast.show({
        type: 'error',
        text1: 'Error getting current location!!',
        text2: error.message,
      });
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    },
  );

  return origin;
}
